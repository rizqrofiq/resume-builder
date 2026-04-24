# BuilderATS - Professional Resume Builder

A modern, fast, and highly customizable resume builder built with React, TypeScript, TailwindCSS, and Vite. Create professional, ATS-friendly resumes with a real-time preview and seamless PDF export.

## ✨ Features

- **Live Preview:** See your changes instantly as you type and tweak settings.
- **Multiple Templates:** Choose between Classic and Modern layouts.
- **Extensive Customization:**
  - Adjust typography, font sizes, and layout density (compact, normal, relaxed).
  - Customize primary and text colors to match your brand.
  - Toggle and customize section dividers (thickness, style, opacity, alignment).
  - Advanced header styling (alignment, individual font sizing for Name, Job Title, Contact Info).
  - Profile photo support with granular controls (shape, size, positioning).
- **Dynamic Sections:**
  - Built-in sections for Experience, Education, and Skills.
  - Add unlimited **Custom Sections** with repeatable items.
  - Easily toggle visibility of any section.
- **PDF Export:** High-quality, print-ready PDF generation using `react-to-print`.
- **Privacy First:** All data processing is done locally in your browser. No backend, no data collection.

## 🛠️ Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Icons:** Lucide React
- **PDF Generation:** React-to-Print

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/rizqrofiq/resume-builder.git
   cd resume-builder
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

4. Build for production
   ```bash
   npm run build
   ```

## 💡 Usage

1. **Fill in your details:** Start by adding your personal information, experience, education, and skills in the left-hand editor pane.
2. **Customize the design:** Use the **Design & Layout** section to tweak the template, fonts, colors, section dividers, and header layout to match your personal brand.
3. **Add Custom Sections:** Need a section for Projects, Certifications, or Languages? Click "Add Custom Section" at the bottom of the editor.
4. **Download:** Click the "Download PDF" button in the top right header to save your resume to your machine.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](https://github.com/rizqrofiq/resume-builder/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
