import 'dotenv/config';

async function testAdminAPI() {
  try {
    console.log('🧪 Testing Admin API...\n');

    // Test 1: Check if admin profile API is accessible
    console.log('1️⃣ Testing admin profile API...');
    const profileRes = await fetch('http://localhost:3000/api/admin/profile');
    console.log('Profile API Status:', profileRes.status);
    
    if (profileRes.status === 401) {
      console.log('⚠️  Admin not authenticated. This is expected if not logged in.');
    } else {
      const profileData = await profileRes.json();
      console.log('Profile API Response:', profileData);
    }

    // Test 2: Check students API (this should work even without auth for testing)
    console.log('\n2️⃣ Testing students API...');
    const studentsRes = await fetch('http://localhost:3000/api/admin/profile?students=1');
    console.log('Students API Status:', studentsRes.status);
    
    if (studentsRes.status === 401) {
      console.log('⚠️  Admin authentication required for students API.');
    } else {
      const studentsData = await studentsRes.json();
      console.log('Students API Response:', studentsData);
      
      if (studentsData.success && studentsData.students) {
        console.log(`📊 Found ${studentsData.students.length} students`);
        studentsData.students.forEach((student, index) => {
          console.log(`${index + 1}. ${student.fullName} - ${student.course}`);
        });
      }
    }

    // Test 3: Check courses API
    console.log('\n3️⃣ Testing courses API...');
    const coursesRes = await fetch('http://localhost:3000/api/courses');
    console.log('Courses API Status:', coursesRes.status);
    
    const coursesData = await coursesRes.json();
    console.log(`📊 Found ${coursesData.length} courses`);
    coursesData.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} - ₹${course.currentPrice}`);
    });

    // Test 4: Check stats API
    console.log('\n4️⃣ Testing stats API...');
    const statsRes = await fetch('http://localhost:3000/api/admin/profile?stats=1');
    console.log('Stats API Status:', statsRes.status);
    
    if (statsRes.status === 401) {
      console.log('⚠️  Admin authentication required for stats API.');
    } else {
      const statsData = await statsRes.json();
      console.log('Stats API Response:', statsData);
    }

    console.log('\n✅ API testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testAdminAPI(); 