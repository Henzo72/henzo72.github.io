document.addEventListener('DOMContentLoaded', () => {

    // --- Burger Menu Logic ---
    const burger = document.getElementById('burger-menu');
    const nav = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('#nav-links a');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            });
        });
    }
    
    // --- Magnetic Button Effect ---
    const magneticElements = document.querySelectorAll('.magnetic-btn');

    magneticElements.forEach((elem) => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Limit the movement
            const pullX = x * 0.3;
            const pullY = y * 0.3;
            
            elem.style.transform = `translate(${pullX}px, ${pullY}px)`;
        });

        elem.addEventListener('mouseleave', () => {
            elem.style.transform = `translate(0px, 0px)`;
        });
    });

    // --- 3D Scene Interactive Mouse Tracking ---
    const container3d = document.querySelector('.magnetic-3d');
    if (container3d) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            
            // Add initial rotation bias + mouse position
            container3d.style.transform = `rotateY(${xAxis + 20}deg) rotateX(${yAxis - 15}deg)`;
        });
    }

    // --- Intersection Observer for Progress Bars ---
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserverOptions = {
        threshold: 0.5,
        rootMargin: "0px 0px -100px 0px"
    };

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                observer.unobserve(bar);
            }
        });
    }, progressObserverOptions);

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // --- Horizontal Scroll Logic ---
    const projectsSection = document.getElementById('projects');
    const scrollContainer = document.querySelector('.horizontal-scroll-container');
    
    // Only apply on non-mobile devices based on CSS media query logic
    const checkHorizontalScroll = () => {
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', onScrollHorizontal);
        } else {
            window.removeEventListener('scroll', onScrollHorizontal);
            if (scrollContainer) scrollContainer.style.transform = 'translateX(0)';
        }
    };

    const onScrollHorizontal = () => {
        if (!projectsSection || !scrollContainer) return;
        
        const rect = projectsSection.getBoundingClientRect();
        
        // Check if section is in viewport
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
            // How far have we scrolled through this section
            const scrolledPercentage = Math.abs(rect.top) / (projectsSection.offsetHeight - window.innerHeight);
            // Translate the container based on percentage and max scrollable width
            const maxTranslate = scrollContainer.scrollWidth - window.innerWidth + (window.innerWidth * 0.1); // Add 10vw padding
            
            scrollContainer.style.transform = `translateX(-${scrolledPercentage * maxTranslate}px)`;
        } else if (rect.top > 0) {
            scrollContainer.style.transform = `translateX(0px)`;
        } else if (rect.bottom < window.innerHeight) {
            // Stick to the end when fully scrolled past
            const maxTranslate = scrollContainer.scrollWidth - window.innerWidth + (window.innerWidth * 0.1);
            scrollContainer.style.transform = `translateX(-${maxTranslate}px)`;
        }
    };

    // Initialize and handle resizes
    checkHorizontalScroll();
    window.addEventListener('resize', checkHorizontalScroll);

    // --- Timeline Illumination Logic ---
    const timelineSection = document.getElementById('experience');
    const timelineFill = document.querySelector('.timeline-line-fill');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    window.addEventListener('scroll', () => {
        if (!timelineSection || !timelineFill) return;
        
        const rect = timelineSection.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = timelineSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Check if timeline section is in view
        if (sectionTop < windowHeight && rect.bottom > 0) {
            // Calculate progress based on scroll position relative to the section
            // Start filling when the top of the section comes into view, end when bottom leaves
            let scrollProgress = (windowHeight / 2 - sectionTop) / (sectionHeight);
            
            // Clamp between 0% and 100%
            scrollProgress = Math.min(Math.max(scrollProgress, 0), 1);
            
            timelineFill.style.height = `${scrollProgress * 100}%`;

            // Active state for timeline dots
            timelineItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                // If dot passes middle of screen, set active
                if (itemRect.top < windowHeight * 0.6) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    });

    // --- Copy to Clipboard Logic ---
    const copyBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');
    const copyFeedback = document.getElementById('copy-feedback');

    if (copyBtn && emailText && copyFeedback) {
        copyBtn.addEventListener('click', () => {
            const email = emailText.innerText;
            navigator.clipboard.writeText(email).then(() => {
                copyFeedback.classList.add('show');
                
                // Hide feedback after 2.5 seconds
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                }, 2500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

});
