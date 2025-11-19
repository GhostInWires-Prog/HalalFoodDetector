import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Brain, Camera, BarChart3, Cpu } from 'lucide-react';
import imageOne from '../1.jpg';
import imageTwo from '../2.jpg';
import imageThree from '../3.jpg';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = useMemo(() => [
    // Title Slide
    {
      title: "Halal Product Intelligence System",
      subtitle: "AI-Powered Automated Product Classification",
      content: (
        <div className="text-center space-y-10 md:space-y-12">
          <div className="text-6xl md:text-8xl">🕌</div>
          <h2 className="text-5xl font-bold text-green-600 md:text-6xl">Deep Learning for Halal Verification</h2>
          <div className="space-y-2 text-2xl text-gray-600 md:text-3xl">
            <p>Affan Ahmad | Muqqadam Tahir | Abdurehman</p>
            <p className="text-xl md:text-2xl">Computer Vision Project</p>
          </div>
        </div>
      )
    },
    
    // Problem Statement
    {
      title: "The Challenge",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
              <h3 className="mb-3 text-2xl font-bold text-red-700 md:text-3xl">Problem</h3>
              <ul className="space-y-3 text-lg text-gray-700 md:text-xl">
                <li>• 1.8B Muslims need halal verification</li>
                <li>• Complex E-codes (E471, E120)</li>
                <li>• Manual verification is slow & error-prone</li>
                <li>• Cryptic ingredient lists</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="mb-3 text-2xl font-bold text-green-700 md:text-3xl">Solution</h3>
              <ul className="space-y-3 text-lg text-gray-700 md:text-xl">
                <li>• Automated multi-modal AI system</li>
                <li>• Real-time image analysis</li>
                <li>• 99% accuracy on ingredients</li>
                <li>• Mobile-ready deployment</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-semibold text-blue-800 md:text-3xl">Global Halal Market: $2+ Trillion Annually</p>
          </div>
        </div>
      )
    },

    // System Architecture
    {
      title: "System Architecture",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6">
            <h3 className="mb-4 text-2xl font-bold text-center md:text-3xl">Multi-Modal Pipeline</h3>
            <div className="space-y-4 text-lg md:text-xl">
              <div className="flex items-center gap-3 bg-white p-3 rounded shadow-sm">
                <Camera className="text-blue-600" size={24} />
                <div className="flex-1">
                  <p className="font-semibold">1. Image Input</p>
                  <p className="text-gray-600">Product packaging photo</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded shadow-sm">
                <Cpu className="text-purple-600" size={24} />
                <div className="flex-1">
                  <p className="font-semibold">2. Parallel Processing</p>
                  <p className="text-gray-600">OCR + Barcode + Logo Detection</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded shadow-sm">
                <Brain className="text-green-600" size={24} />
                <div className="flex-1">
                  <p className="font-semibold">3. AI Classification</p>
                  <p className="text-gray-600">3 Deep Learning Models</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded shadow-sm">
                <BarChart3 className="text-orange-600" size={24} />
                <div className="flex-1">
                  <p className="font-semibold">4. Ensemble Fusion</p>
                  <p className="text-gray-600">Weighted verdict with confidence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Model 1: Ingredient Classifier
    {
      title: "Model #1: Ingredient Text Classifier",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">CNN-Based Text Analysis</h3>
            <p className="text-gray-700">Analyzes ingredient lists using deep learning</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-3 text-blue-700">Architecture</h4>
              <ul className="space-y-1 text-base text-gray-700 md:text-lg">
                <li>→ TextVectorization (20K tokens)</li>
                <li>→ Embedding Layer (128D)</li>
                <li>→ Conv1D (128 filters, size 5)</li>
                <li>→ GlobalMaxPooling</li>
                <li>→ Dense + Dropout (0.3)</li>
                <li>→ Softmax (3 classes)</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-3 text-green-700">Training Details</h4>
              <ul className="space-y-1 text-base text-gray-700 md:text-lg">
                <li>• Dataset: 39,715 samples</li>
                <li>• Optimizer: Adam (lr=1e-3)</li>
                <li>• Batch Size: 64</li>
                <li>• Early Stopping (patience=3)</li>
                <li>• LR Scheduler (ReduceLROnPlateau)</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-700">99.4% Accuracy</p>
            <p className="text-xl text-gray-600 md:text-2xl">F1-Score: 0.99 | AUC: 0.998</p>
          </div>
        </div>
      )
    },

    // Model 2: Logo Detector
    {
      title: "Model #2: Halal Logo Detector",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Transfer Learning with MobileNetV2</h3>
            <p className="text-gray-700">Detects halal certification logos on packaging</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-3 text-purple-700">Architecture</h4>
              <ul className="space-y-1 text-base text-gray-700 md:text-lg">
                <li>→ MobileNetV2 (ImageNet)</li>
                <li>→ Frozen Backbone</li>
                <li>→ GlobalAveragePooling2D</li>
                <li>→ Dropout (0.3)</li>
                <li>→ Dense (Sigmoid)</li>
                <li>→ Input: 224×224×3</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-3 text-pink-700">Why MobileNetV2?</h4>
              <ul className="space-y-1 text-base text-gray-700 md:text-lg">
                <li>✓ Mobile-optimized</li>
                <li>✓ 60% faster training vs VGG16</li>
                <li>✓ Separable convolutions</li>
                <li>✓ Real-time inference</li>
                <li>✓ Low memory footprint</li>
                <li>• Dataset: 714 logo images</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-100 border-2 border-purple-500 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-700">87.4% Accuracy</p>
            <p className="text-xl text-gray-600 md:text-2xl">Handles multiple certification authorities (JAKIM, MUI, HFA)</p>
          </div>
        </div>
      )
    },

    // Model 3: Barcode Classifier
    {
      title: "Model #3: Barcode Status Classifier",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">LSTM-Based E-Code Analysis</h3>
            <p className="text-gray-700">Character-level sequence modeling for E-codes</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-3 text-orange-700">Architecture</h4>
              <ul className="space-y-1 text-base text-gray-700 md:text-lg">
                <li>→ Character-level Vectorization</li>
                <li>→ Embedding (32D)</li>
                <li>→ Bidirectional LSTM (32 units)</li>
                <li>→ Dense + ReLU</li>
                <li>→ Softmax (2 classes)</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-3 text-yellow-700">Why LSTM?</h4>
              <ul className="space-y-1 text-base text-gray-700 md:text-lg">
                <li>✓ Captures E-code patterns</li>
                <li>✓ Sequential digit relationships</li>
                <li>✓ E471, E120 structure learning</li>
                <li>• Barcode scanning: pyzbar</li>
                <li>• E-code registry: 130 samples</li>
              </ul>
            </div>
          </div>

          <div className="bg-orange-100 border-2 border-orange-500 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-700">81% Accuracy</p>
            <p className="text-xl text-gray-600 md:text-2xl">F1-Score: 0.81 | Handles Halal/Mushbooh E-codes</p>
          </div>
        </div>
      )
    },

    // Ensemble Fusion
    {
      title: "Ensemble Fusion Engine",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Weighted Voting System</h3>
            <p className="text-gray-700">Combines all evidence sources for final verdict</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-3 text-xl md:text-2xl">Weight Distribution</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-36 text-base font-semibold text-slate-700 md:text-lg">Barcode Match:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div className="bg-blue-500 h-6 rounded-full flex items-center justify-center text-white text-lg font-bold md:text-xl" style={{width: '100%'}}>1.0</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-36 text-base font-semibold text-slate-700 md:text-lg">Logo Detected:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div className="bg-purple-500 h-6 rounded-full flex items-center justify-center text-white text-lg font-bold md:text-xl" style={{width: '100%'}}>1.0</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-36 text-base font-semibold text-slate-700 md:text-lg">Ingredient Text:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div className="bg-green-500 h-6 rounded-full flex items-center justify-center text-white text-lg font-bold md:text-xl" style={{width: '98%'}}>0.98</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-36 text-base font-semibold text-slate-700 md:text-lg">E-code Match:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div className="bg-orange-500 h-6 rounded-full flex items-center justify-center text-white text-lg font-bold md:text-xl" style={{width: '60%'}}>0.6</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <h4 className="mb-2 text-xl font-semibold md:text-2xl">Precautionary Principle</h4>
            <p className="text-base text-gray-700 md:text-lg">Tie-breaking priority: <span className="font-bold text-red-600">Haram</span> {'>'} <span className="font-bold text-green-600">Halal</span> {'>'} <span className="font-bold text-yellow-600">Mushbooh</span></p>
            <p className="mt-3 text-lg text-gray-600 md:text-xl">Defaults to more restrictive verdict when evidence is ambiguous</p>
          </div>
        </div>
      )
    },

    // Results Summary
    {
      title: "Performance Summary",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border-2 border-green-500 bg-green-50 p-5 text-center">
              <div className="text-4xl font-bold text-green-700 md:text-5xl">99.4%</div>
              <div className="text-base text-gray-600 md:text-lg">Ingredient Classifier</div>
              <div className="mt-2 text-lg text-gray-500 md:text-xl">AUC: 0.998</div>
            </div>
            <div className="rounded-lg border-2 border-purple-500 bg-purple-50 p-5 text-center">
              <div className="text-4xl font-bold text-purple-700 md:text-5xl">87.4%</div>
              <div className="text-base text-gray-600 md:text-lg">Logo Detector</div>
              <div className="mt-2 text-lg text-gray-500 md:text-xl">AUC: 0.92</div>
            </div>
            <div className="rounded-lg border-2 border-orange-500 bg-orange-50 p-5 text-center">
              <div className="text-4xl font-bold text-orange-700 md:text-5xl">81.0%</div>
              <div className="text-base text-gray-600 md:text-lg">Barcode Classifier</div>
              <div className="mt-2 text-lg text-gray-500 md:text-xl">AUC: 0.88</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-3 text-xl md:text-2xl">Dataset Statistics</h4>
            <div className="grid grid-cols-3 gap-3 text-center text-base md:text-lg">
              <div>
                <div className="text-3xl font-bold text-blue-600 md:text-4xl">39,715</div>
                <div className="text-lg text-gray-600 md:text-xl">Ingredient Samples</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 md:text-4xl">714</div>
                <div className="text-lg text-gray-600 md:text-xl">Logo Images</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 md:text-4xl">130</div>
                <div className="text-lg text-gray-600 md:text-xl">E-code Registry</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-5">
            <h4 className="mb-3 text-xl font-semibold md:text-2xl">Key Achievements</h4>
            <ul className="space-y-1 text-base text-gray-700 md:text-lg">
              <li>✓ Near-perfect AUC (0.998) for ingredient classification</li>
              <li>✓ 100% recall on Halal class (no false negatives)</li>
              <li>✓ Mobile-optimized models (TensorFlow Lite ready)</li>
              <li>✓ Sub-2-second inference time on mobile devices</li>
              <li>✓ Multi-source data integration (Kaggle, Roboflow, Web scraping)</li>
            </ul>
          </div>
        </div>
      )
    },

    // Dataset & References
    {
      title: "Dataset & Reference Links",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-5">
            <h4 className="mb-3 text-xl font-semibold text-blue-700 md:text-2xl">Primary Resources</h4>
            <ul className="space-y-2 text-base text-gray-700 md:text-lg">
              <li>
                <a
                  href="https://www.ecodehalalcheck.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  eCode Halal Check
                </a>{" "}
                — Comprehensive ingredient status lookup
              </li>
              <li>
                <a
                  href="https://international-halal.com/ecodes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  International Halal e-Codes
                </a>{" "}
                — Global regulatory insights for additives
              </li>
              <li>
                <a
                  href="https://ecode.figlab.io/quick_list.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  FIGLab Quick e-Code List
                </a>{" "}
                — Rapid reference for Mushbooh/Haram markers
              </li>
            </ul>
          </div>

          <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-5">
            <h4 className="mb-3 text-xl font-semibold text-green-700 md:text-2xl">Datasets & Configurations</h4>
            <ul className="space-y-2 text-base text-gray-700 md:text-lg">
              <li>
                <a
                  href="https://www.kaggle.com/datasets/irfanakbarihabibi/food-ingredients-dataset-with-halal-label"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  food_ingredients_halal_label
                </a>{" "}
                — Ingredient-level halal annotations (39K+ rows)
              </li>
              <li>
                <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-800">ROBOFLOW_CONFIG</code>{" "}
                — Roboflow project configuration for logo detection dataset
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // Technology Stack
    {
      title: "Technology Stack",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-orange-50 p-5">
              <h4 className="mb-3 text-xl font-semibold text-orange-700 md:text-2xl">Deep Learning</h4>
              <ul className="space-y-1 text-base text-gray-700 md:text-lg">
                <li>• TensorFlow/Keras 2.19.0</li>
                <li>• MobileNetV2 (ImageNet)</li>
                <li>• Conv1D for text</li>
                <li>• LSTM for sequences</li>
              </ul>
            </div>
            <div className="rounded-lg bg-blue-50 p-5">
              <h4 className="mb-3 text-xl font-semibold text-blue-700 md:text-2xl">Computer Vision</h4>
              <ul className="space-y-1 text-base text-gray-700 md:text-lg">
                <li>• EasyOCR 1.7.1</li>
                <li>• OpenCV 4.9.0</li>
                <li>• pyzbar 0.23.92</li>
                <li>• Image preprocessing</li>
              </ul>
            </div>
            <div className="rounded-lg bg-green-50 p-5">
              <h4 className="mb-3 text-xl font-semibold text-green-700 md:text-2xl">Data Processing</h4>
              <ul className="space-y-1 text-base text-gray-700 md:text-lg">
                <li>• scikit-learn</li>
                <li>• BeautifulSoup4</li>
                <li>• Web scraping pipeline</li>
                <li>• Data augmentation</li>
              </ul>
            </div>
            <div className="rounded-lg bg-purple-50 p-5">
              <h4 className="mb-3 text-xl font-semibold text-purple-700 md:text-2xl">Deployment</h4>
              <ul className="space-y-1 text-base text-gray-700 md:text-lg">
                <li>• Google Colab (GPU)</li>
                <li>• Android/iOS ready</li>
                <li>• TensorFlow Lite</li>
                <li>• Model exports (.h5, .keras)</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-5">
            <h4 className="mb-3 text-xl font-semibold md:text-2xl">Model Artifacts</h4>
            <div className="grid grid-cols-2 gap-2 text-base text-gray-700 md:text-lg">
              <div>• ingredient_text_classifier.h5 (140 MB)</div>
              <div>• halal_logo_detector.keras (14 MB)</div>
              <div>• barcode_status_classifier.h5 (2 MB)</div>
              <div>• Label encoders & vocabularies</div>
            </div>
          </div>
        </div>
      )
    },

    // Conclusion
    {
      title: "Conclusion & Impact",
      content: (
        <div className="space-y-6">
          <div className="rounded-lg border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
            <h3 className="mb-3 text-2xl font-bold text-green-700 md:text-3xl">Impact</h3>
            <ul className="space-y-2 text-base text-gray-700 md:text-lg">
              <li>✓ Empowers 1.8 billion Muslims with instant verification</li>
              <li>✓ Eliminates manual ingredient checking errors</li>
              <li>✓ Democratizes access to halal certification</li>
              <li>✓ Real-time decision making in stores</li>
            </ul>
          </div>

          <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-5">
            <h3 className="mb-2 text-2xl font-bold text-yellow-700 md:text-3xl">Future Work</h3>
            <ul className="space-y-1 text-base text-gray-700 md:text-lg">
              <li>• Address Mushbooh class imbalance (active learning)</li>
              <li>• Few-shot learning for logo variation</li>
              <li>• Reinforcement learning for weight optimization</li>
              <li>• Knowledge graphs for ingredient sourcing (E471 origins)</li>
              <li>• Extension to kosher, vegan, allergen-free verification</li>
            </ul>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center text-white">
            <h2 className="mb-2 text-4xl font-bold md:text-5xl">AI-Assisted Dietary Compliance</h2>
            <p className="text-xl md:text-2xl">Making informed choices aligned with religious values</p>
          </div>
        </div>
      )
    },

    // Field Visuals
    {
      title: "Field Deployments",
      subtitle: "Real-world packaging analysis samples",
      content: (
        <div className="grid min-h-[60vh] grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { src: imageOne, alt: 'Captured product packaging 1' },
            { src: imageTwo, alt: 'Captured product packaging 2' },
            { src: imageThree, alt: 'Captured product packaging 3' }
          ].map(({ src, alt }, index) => (
            <figure
              key={index}
              className="flex min-h-[18rem] flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-lg backdrop-blur-sm md:min-h-[24rem]"
            >
              <img
                src={src}
                alt={alt}
                className="h-full w-full flex-1 object-cover"
              />
              <figcaption className="px-4 py-3 text-base font-semibold text-slate-700 md:text-lg">
                {alt}
              </figcaption>
            </figure>
          ))}
        </div>
      )
    }
  ], []);

  const totalSlides = slides.length;
  const themePalette = useMemo(
    () => [
      {
        surface: 'from-white/85 via-sky-50/80 to-white/85',
        glow: 'from-sky-500/45 via-emerald-400/30 to-indigo-400/30',
        indicator: 'bg-sky-500',
        primaryButton: 'from-sky-500 via-indigo-500 to-purple-500'
      },
      {
        surface: 'from-white/85 via-emerald-50/75 to-white/80',
        glow: 'from-emerald-400/40 via-cyan-300/30 to-blue-400/35',
        indicator: 'bg-emerald-500',
        primaryButton: 'from-emerald-500 via-teal-500 to-blue-500'
      },
      {
        surface: 'from-white/85 via-rose-50/70 to-white/85',
        glow: 'from-purple-500/40 via-rose-400/30 to-amber-400/30',
        indicator: 'bg-purple-500',
        primaryButton: 'from-purple-500 via-pink-500 to-rose-500'
      },
      {
        surface: 'from-white/85 via-amber-50/75 to-white/85',
        glow: 'from-amber-400/40 via-rose-300/25 to-indigo-400/30',
        indicator: 'bg-amber-500',
        primaryButton: 'from-amber-500 via-rose-500 to-purple-500'
      }
    ],
    []
  );
  const currentTheme = useMemo(
    () => themePalette[currentSlide % themePalette.length],
    [currentSlide, themePalette]
  );
  const progress = useMemo(
    () => Math.round(((currentSlide + 1) / totalSlides) * 100),
    [currentSlide, totalSlides]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide]);

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -top-36 -left-32 h-96 w-96 rounded-full bg-gradient-to-br ${currentTheme.glow} blur-3xl opacity-70 animate-blob`}
        />
        <div
          className={`absolute -bottom-40 -right-28 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br ${currentTheme.glow} blur-3xl opacity-60 animate-blob-reverse`}
        />
        <div className="absolute inset-0 bg-grid-soft bg-[size:28px_28px] opacity-40" />
      </div>

      <div className="relative z-10 flex min-h-screen w-full flex-col px-6 py-8 sm:px-10 md:px-16 lg:px-24">
        {/* Slide Container */}
        <div
          className={`relative flex flex-1 flex-col overflow-hidden rounded-4xl border border-white/35 bg-gradient-to-br ${currentTheme.surface} p-6 shadow-ultralight backdrop-blur-2xl transition-all duration-700 ease-out sm:p-10 md:p-14`}
        >
          <span className="pointer-events-none absolute inset-x-8 top-10 h-28 rounded-full bg-white/40 blur-3xl" />
          <span className="pointer-events-none absolute inset-0 bg-aurora opacity-25 mix-blend-soft-light" />

          {/* Header */}
          <div className="relative mb-10">
            {slides[currentSlide].title && (
              <h1
                key={`title-${currentSlide}`}
                className="animate-title-pop bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-sm md:text-6xl"
              >
                {slides[currentSlide].title}
              </h1>
            )}
            {slides[currentSlide].subtitle && (
              <p
                key={`subtitle-${currentSlide}`}
                className="animate-subtitle-slide text-2xl text-slate-600 md:text-3xl"
              >
                {slides[currentSlide].subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="relative flex-1 overflow-y-auto py-4 pr-1 text-xl leading-relaxed md:py-6 md:pr-2 md:text-[1.85rem]">
            <div
              key={`content-${currentSlide}`}
              className="animate-fade-in-up space-y-6 [&_h2]:text-4xl [&_h3]:text-3xl [&_h4]:text-2xl [&_li]:text-[1.25rem] [&_p]:text-[1.3rem] [&_span.font-bold]:text-[1.3rem] [&_div>*]:leading-snug md:[&_li]:text-[1.5rem] md:[&_p]:text-[1.55rem] md:[&_span.font-bold]:text-[1.55rem]"
            >
              {slides[currentSlide].content}
            </div>
          </div>

          {/* Slide Number */}
          <div className="pointer-events-none absolute bottom-6 right-6 text-lg font-semibold text-slate-500 md:text-xl">
            Slide {currentSlide + 1} / {totalSlides}
          </div>
        </div>

        {/* Progress */}
        <div className="relative mt-8">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-lg">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-center text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
            {progress}% Complete
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 px-5 py-4 shadow-ultralight backdrop-blur-xl sm:px-8 md:px-10">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 px-6 py-3 text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="rounded-full bg-white/70 p-1 shadow-inner transition-all duration-300 group-hover:bg-white">
              <ChevronLeft size={18} />
            </span>
            Previous
          </button>

          {/* Slide Indicators */}
          <div className="flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ease-out ${
                  index === currentSlide
                    ? `${currentTheme.indicator} w-12 shadow-glow`
                    : 'w-2 bg-slate-300/70 hover:w-4 hover:bg-slate-400/80'
                }`}
              >
                <span className="sr-only">Go to slide {index + 1}</span>
              </button>
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`group flex items-center gap-2 rounded-full bg-gradient-to-r ${currentTheme.primaryButton} px-6 py-3 text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(59,130,246,0.65)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Next
            <span className="rounded-full bg-white/20 p-1 transition-all duration-300 group-hover:bg-white/30">
              <ChevronRight size={18} />
            </span>
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="mt-4 rounded-2xl border border-white/30 bg-white/60 py-4 text-center text-lg text-slate-600 shadow-ultralight backdrop-blur-lg md:text-xl">
          Use ← → arrow keys or click buttons to navigate
        </div>
      </div>
    </div>
  );
};

export default Presentation;

