import mongoose from 'mongoose';

const HomepageSchema = new mongoose.Schema({
  mainHeadingWhite: {
    type: String,
    default: "Welcome to"
  },
  mainHeadingOrange: {
    type: String,
    default: "Shoora Tech"
  },
  typewriterTexts: [{
    text: String,
    highlights: [String]
  }],
  stats: {
    studentsTaught: {
      type: String,
      default: "1000+"
    },
    instructors: {
      type: String,
      default: "25+"
    },
    liveProjects: {
      type: String,
      default: "50+"
    }
  },
  heroImageText: {
    type: String,
    default: "Transform your future with"
  },
  heroImageTextHighlight: {
    type: String,
    default: "Shoora Tech"
  },
  heroMedia: {
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image'
    },
    url: {
      type: String,
      default: "/assets/bg.svg"
    }
  },
  companies: [{
    src: String,
    alt: String,
    title: String
  }],
  faqs: [{
    question: String,
    answer: String
  }]
}, {
  timestamps: true
});

// Ensure only one homepage document exists
HomepageSchema.statics.getHomepage = async function() {
  let homepage = await this.findOne();
  if (!homepage) {
    // Create default homepage if none exists
    homepage = await this.create({
      mainHeadingWhite: "Welcome to",
      mainHeadingOrange: "Shoora Tech",
      typewriterTexts: [
        { text: "Learn coding and technology skills", highlights: ["coding", "technology"] },
        { text: "Master web development and programming", highlights: ["web development", "programming"] },
        { text: "Build your career in tech industry", highlights: ["career", "tech industry"] }
      ],
      stats: {
        studentsTaught: "1000+",
        instructors: "25+",
        liveProjects: "50+"
      },
      heroImageText: "Transform your future with",
      heroImageTextHighlight: "Shoora Tech",
      heroMedia: {
        type: "image",
        url: "/assets/bg.svg"
      },
      companies: [
        { src: "/assets/google-icon.svg", alt: "Google", title: "Google" },
        { src: "/assets/microsoft-icon.svg", alt: "Microsoft", title: "Microsoft" },
        { src: "/assets/apple-icon.svg", alt: "Apple", title: "Apple" },
        { src: "/assets/amazon-icon.svg", alt: "Amazon", title: "Amazon" }
      ],
      faqs: [
        {
          question: "What courses do you offer?",
          answer: "We offer comprehensive courses in web development, programming, and technology."
        },
        {
          question: "How long are the courses?",
          answer: "Our courses range from 2 weeks to 6 months depending on the complexity."
        }
      ]
    });
  }
  return homepage;
};

export default mongoose.models.Homepage || mongoose.model('Homepage', HomepageSchema); 