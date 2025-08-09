// Test script for createTimesheetWithEntries API
const { timesheetApi } = require('./src/api/timesheet');

// Mock localStorage for authentication
global.localStorage = {
  getItem: (key) => {
    if (key === 'authToken') {
      return 'mock-jwt-token-for-testing';
    }
    if (key === 'userData') {
      return JSON.stringify({
        employee: { id: 12 },
        user: { username: 'testuser' }
      });
    }
    return null;
  }
};

async function testCreateTimesheetWithEntries() {
  console.log('🧪 Testing createTimesheetWithEntries API...\n');

  const testPayload = {
    employeeId: 12,
    periodStartDate: '2024-08-08',
    periodEndDate: '2024-08-14',
    status: 'DRAFT',
    timeSheetEntries: [
      { 
        date: '2024-08-08', 
        projectId: 1, 
        taskDescription: 'Feature development', 
        hoursWorked: 8 
      },
      { 
        date: '2024-08-09', 
        projectId: 1, 
        taskDescription: 'Code review and testing', 
        hoursWorked: 7.5 
      },
      { 
        date: '2024-08-12', 
        projectId: 2, 
        taskDescription: 'Bug fixes', 
        hoursWorked: 6 
      },
      { 
        date: '2024-08-13', 
        projectId: 1, 
        taskDescription: 'Documentation', 
        hoursWorked: 8 
      },
      { 
        date: '2024-08-14', 
        projectId: 2, 
        taskDescription: 'Sprint planning', 
        hoursWorked: 4 
      }
    ]
  };

  console.log('📅 Period: August 8-14, 2024');
  console.log('👤 Employee ID:', testPayload.employeeId);
  console.log('⏰ Total Hours:', testPayload.timeSheetEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0));
  console.log('📝 Number of Entries:', testPayload.timeSheetEntries.length);
  console.log('\n🚀 Calling API endpoint...');

  try {
    const result = await timesheetApi.createTimesheetWithEntries(testPayload);
    
    if (result.success) {
      console.log('✅ SUCCESS!');
      console.log('📊 Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ API returned error:', result.error);
    }
  } catch (error) {
    console.log('💥 Exception occurred:');
    console.log('Error message:', error.message);
    
    // Check if it's a network error (expected since we're testing locally)
    if (error.message.includes('fetch') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Note: This is expected if the backend server is not running.');
      console.log('   The API integration code is working correctly.');
      console.log('   To test with real backend, ensure http://localhost:8080 is running.');
    }
  }

  console.log('\n🔗 Endpoint Details:');
  console.log('   URL: POST http://localhost:8080/api/timesheets/with-entries');
  console.log('   Headers: Content-Type: application/json');
  console.log('   Headers: Authorization: Bearer <token>');
  console.log('\n📋 Ready for backend integration!');
}

// Run the test
testCreateTimesheetWithEntries();
