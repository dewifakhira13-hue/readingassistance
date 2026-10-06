import { RawSessionRecord, GoogleSheetsConfig } from '../types';

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * ==============================================================
 * Google Sheets Apps Script API Connector
 * English Reading Teacher Dashboard
 * ==============================================================
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet with the student reading data.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete existing code and paste this entire file.
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Set Description: "English Reading Live Data Sync".
 * 7. Set "Execute as": "Me" (your Google account).
 * 8. Set "Who has access": "Anyone" (crucial for web app fetch).
 * 9. Click "Deploy", copy the "Web app URL" (ends in /exec).
 * 10. Paste the URL into the Dashboard Settings / Connection bar.
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var values = sheet.getDataRange().getValues();
    
    if (values.length < 2) {
      return createJsonResponse({ status: "error", message: "Sheet has no data rows" });
    }
    
    var headers = values[0].map(function(h) {
      return String(h).trim();
    });
    
    var records = [];
    
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      // Skip completely empty rows
      if (row.join("").trim() === "") continue;
      
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j];
        var val = row[j];
        
        // Auto convert numeric fields
        if (key.indexOf("Score") !== -1 || key.indexOf("Level") !== -1 || 
            key.indexOf("Percent") !== -1 || key.indexOf("Seconds") !== -1 || 
            key === "Session") {
          var num = Number(val);
          obj[key] = isNaN(num) ? val : num;
        } else {
          obj[key] = val;
        }
      }
      records.push(obj);
    }
    
    return createJsonResponse({
      status: "success",
      source: "Google Sheets via Google Apps Script",
      timestamp: new Date().toISOString(),
      count: records.length,
      data: records
    });
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

function createJsonResponse(payload) {
  var output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
`;

const STORAGE_KEY_CONFIG = 'iclarity_google_sheet_config';
const STORAGE_KEY_CUSTOM_DATA = 'iclarity_custom_session_data';

export function getStoredSheetConfig(): GoogleSheetsConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse sheet config', e);
  }
  return {
    sheetUrl: '',
    appsScriptUrl: '',
    autoSync: false,
    lastSyncTime: null,
    status: 'idle',
  };
}

export function saveSheetConfig(config: GoogleSheetsConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save sheet config', e);
  }
}

export function getStoredCustomData(): RawSessionRecord[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_DATA);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read custom data', e);
  }
  return null;
}

export function saveCustomData(records: RawSessionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_DATA, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save custom data', e);
  }
}

export function clearCustomData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_DATA);
  } catch (e) {
    console.error('Failed to clear custom data', e);
  }
}

export async function fetchFromGoogleAppsScript(url: string): Promise<RawSessionRecord[]> {
  const trimmed = url.trim();
  if (!trimmed) {
    throw new Error('Google Apps Script URL cannot be empty.');
  }

  const response = await fetch(trimmed, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from Google Apps Script (HTTP ${response.status})`);
  }

  const result = await response.json();
  const rawList: any[] = Array.isArray(result) ? result : result.data;

  if (!Array.isArray(rawList)) {
    throw new Error('Returned format is invalid. Expected JSON array or object with data array.');
  }

  // Map and validate fields
  return rawList.map((item, idx) => ({
    Student_ID: String(item.Student_ID || `Student_${String(idx + 1).padStart(3, '0')}`),
    Class: String(item.Class || 'VIII-A'),
    Session: Number(item.Session) || 1,
    Reading_Text_ID: String(item.Reading_Text_ID || 'READ-01'),
    Text_Type: String(item.Text_Type || 'Narrative'),
    Text_Level: String(item.Text_Level || 'A2'),
    Reading_Score: Number(item.Reading_Score) || 70,
    Main_Idea_Score: Number(item.Main_Idea_Score) || 70,
    Specific_Information_Score: Number(item.Specific_Information_Score) || 70,
    Inference_Score: Number(item.Inference_Score) || 70,
    Vocabulary_Context_Score: Number(item.Vocabulary_Context_Score) || 70,
    Task_Completion_Percent: Number(item.Task_Completion_Percent) || 80,
    Response_Time_Seconds: Number(item.Response_Time_Seconds) || 360,
    Engagement_Level_1to5: Number(item.Engagement_Level_1to5) || 3,
    Confidence_Level_1to5: Number(item.Confidence_Level_1to5) || 3,
    Reading_Anxiety_1to5: Number(item.Reading_Anxiety_1to5) || 2,
    Motivation_Level_1to5: Number(item.Motivation_Level_1to5) || 3,
    Performance_Level: String(item.Performance_Level || 'Developing'),
  }));
}

export function parseCSVToRecords(csvText: string): RawSessionRecord[] {
  const lines = csvText.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error('CSV must contain at least a header row and one data row.');

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const records: RawSessionRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (values.length < headers.length) continue;

    const row: any = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx];
    });

    records.push({
      Student_ID: String(row.Student_ID || `Student_${String(i).padStart(3, '0')}`),
      Class: String(row.Class || 'VIII-A'),
      Session: Number(row.Session) || 1,
      Reading_Text_ID: String(row.Reading_Text_ID || 'READ-01'),
      Text_Type: String(row.Text_Type || 'Narrative'),
      Text_Level: String(row.Text_Level || 'A2'),
      Reading_Score: Number(row.Reading_Score) || 70,
      Main_Idea_Score: Number(row.Main_Idea_Score) || 70,
      Specific_Information_Score: Number(row.Specific_Information_Score) || 70,
      Inference_Score: Number(row.Inference_Score) || 70,
      Vocabulary_Context_Score: Number(row.Vocabulary_Context_Score) || 70,
      Task_Completion_Percent: Number(row.Task_Completion_Percent) || 80,
      Response_Time_Seconds: Number(row.Response_Time_Seconds) || 360,
      Engagement_Level_1to5: Number(row.Engagement_Level_1to5) || 3,
      Confidence_Level_1to5: Number(row.Confidence_Level_1to5) || 3,
      Reading_Anxiety_1to5: Number(row.Reading_Anxiety_1to5) || 2,
      Motivation_Level_1to5: Number(row.Motivation_Level_1to5) || 3,
      Performance_Level: String(row.Performance_Level || 'Developing'),
    });
  }

  return records;
}

export function exportRecordsToCSV(records: RawSessionRecord[]): string {
  const headers = [
    'Student_ID',
    'Class',
    'Session',
    'Reading_Text_ID',
    'Text_Type',
    'Text_Level',
    'Reading_Score',
    'Main_Idea_Score',
    'Specific_Information_Score',
    'Inference_Score',
    'Vocabulary_Context_Score',
    'Task_Completion_Percent',
    'Response_Time_Seconds',
    'Engagement_Level_1to5',
    'Confidence_Level_1to5',
    'Reading_Anxiety_1to5',
    'Motivation_Level_1to5',
    'Performance_Level',
  ];

  const rows = records.map(r => [
    r.Student_ID,
    r.Class,
    r.Session,
    r.Reading_Text_ID,
    r.Text_Type,
    r.Text_Level,
    r.Reading_Score,
    r.Main_Idea_Score,
    r.Specific_Information_Score,
    r.Inference_Score,
    r.Vocabulary_Context_Score,
    r.Task_Completion_Percent,
    r.Response_Time_Seconds,
    r.Engagement_Level_1to5,
    r.Confidence_Level_1to5,
    r.Reading_Anxiety_1to5,
    r.Motivation_Level_1to5,
    r.Performance_Level,
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}
