import connectDB from '../lib/dbConnect.js';
import Course from '../models/Course.js';

const courses = [
  {
    title: 'Coding with AI (Without Learning Traditional Coding)',
    duration: '6 MONTHS',
    languages: ['Hindi', 'English'],
    originalPrice: '₹12000',
    currentPrice: '₹9000',
    discount: '25% OFF',
    image: 'https://ik.imagekit.io/cybershoora/Shooraverse/Live-Course_Thumbnail.%20Vector%20illustration_?updatedAt=1750021872707',
    badge: 'INSTITUTE',
    link: '#',
    details: [
      'AI Tools',
      'No-Code Platforms',
      'Prompt Engineering',
      'Automation with AI',
      'Practical AI Projects'
    ],
    status: 'active'
  },
  {
    title: 'UI/UX Design',
    duration: '4 MONTHS',
    languages: ['Hindi', 'English'],
    originalPrice: '₹10000',
    currentPrice: '₹7500',
    discount: '25% OFF',
    image: 'https://ik.imagekit.io/cybershoora/Shooraverse/Live-Course_Thumbnail.%20Vector%20illustration_?updatedAt=1750021872707',
    badge: 'INSTITUTE',
    link: '#',
    details: [
      'Figma',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Wireframing',
      'Prototyping',
      'User Research'
    ],
    status: 'active'
  },
  {
    title: 'Web Development',
    duration: '8 MONTHS',
    languages: ['Hindi', 'English'],
    originalPrice: '₹15000',
    currentPrice: '₹12000',
    discount: '20% OFF',
    image: 'https://ik.imagekit.io/cybershoora/Shooraverse/Live-Course_Thumbnail.%20Vector%20illustration_?updatedAt=1750021872707',
    badge: 'INSTITUTE',
    link: '#',
    details: [
      'HTML & CSS',
      'JavaScript',
      'React.js',
      'Node.js',
      'MongoDB',
      'Full Stack Projects'
    ],
    status: 'active'
  },
  {
    title: 'Data Science & Analytics',
    duration: '6 MONTHS',
    languages: ['Hindi', 'English'],
    originalPrice: '₹18000',
    currentPrice: '₹14000',
    discount: '22% OFF',
    image: 'https://ik.imagekit.io/cybershoora/Shooraverse/Live-Course_Thumbnail.%20Vector%20illustration_?updatedAt=1750021872707',
    badge: 'INSTITUTE',
    link: '#',
    details: [
      'Python Programming',
      'Data Analysis',
      'Machine Learning',
      'Statistics',
      'Data Visualization',
      'Real-world Projects'
    ],
    status: 'active'
  }
];

const seedCourses = async () => {
  try {
    await connectDB();
    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log('✅ Courses seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses(); 