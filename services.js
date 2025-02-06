// Timeline Interaction
const timelinePoints = document.querySelectorAll('.timeline-point');
timelinePoints.forEach(point => {
    point.addEventListener('click', () => {
        timelinePoints.forEach(p => p.classList.remove('active'));
        point.classList.add('active');
    });
});

// Comparison Slider
const slider = document.querySelector('.comparison-slider');
const beforeImage = document.querySelector('.before');
const sliderHandle = document.querySelector('.slider-handle');

let isSliding = false;

const updateSliderPosition = (x) => {
    const rect = slider.getBoundingClientRect();
    let position = (x - rect.left) / rect.width;
    position = Math.max(0, Math.min(1, position));
    
    beforeImage.style.clipPath = `inset(0 ${100 - (position * 100)}% 0 0)`;
    sliderHandle.style.left = `${position * 100}%`;
};

slider.addEventListener('mousedown', () => isSliding = true);
window.addEventListener('mouseup', () => isSliding = false);
window.addEventListener('mousemove', (e) => {
    if (!isSliding) return;
    updateSliderPosition(e.clientX);
});

// Load Placeholder Images
const loadPlaceholderImages = () => {
    // Before/After comparison images
    const beforeImg = document.querySelector('.before');
    const afterImg = document.querySelector('.after');
    
    if (beforeImg) {
        beforeImg.src = 'https://via.placeholder.com/800x400/1A1F35/FFFFFF?text=Before+Technical+SEO';
    }
    if (afterImg) {
        afterImg.src = 'https://via.placeholder.com/800x400/1A1F35/FFFFFF?text=After+Technical+SEO';
    }

    // Case study images
    const caseStudyImages = [
        {
            title: 'E-commerce Case Study',
            metrics: 'Loading Speed: 65% Faster'
        },
        {
            title: 'SaaS Platform Case Study',
            metrics: 'Mobile Score: 95/100'
        }
    ];

    document.querySelectorAll('.result-card img').forEach((img, index) => {
        const study = caseStudyImages[index] || caseStudyImages[0];
        img.src = `https://via.placeholder.com/600x300/1A1F35/FFFFFF?text=${study.title}%0A${study.metrics}`;
    });
};

document.addEventListener('DOMContentLoaded', () => {
    loadPlaceholderImages();

    // Simple Toggle FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Simply toggle current item without affecting others
            item.classList.toggle('active');
            
            // Toggle the plus/minus sign
            const toggle = item.querySelector('.toggle');
            toggle.textContent = item.classList.contains('active') ? '−' : '+';
        });
    });
}); 