
document.addEventListener('DOMContentLoaded', () => {
    
    const textBox1 = document.querySelector('.text-box-1');
    const chart2 = document.getElementById('chart_2');
    const textBox2 = document.querySelector('.text-box-2');
    const chart1 = document.getElementById('chart_1');
    const textBox3 = document.querySelector('.text-box-3');
    const chart3 = document.getElementById('chart_3');
    const textBox4 = document.querySelector('.text-box-4');
    const body = document.body;

    
    const elements = [
        textBox1, chart2, textBox2, chart1, textBox3, chart3, textBox4
    ];

    
    if (elements.some(el => !el)) {
        console.error("Scrollytelling elements not found! Check IDs and classes in HTML.");
        console.log("Missing:", elements.map((el, i) => el ? null : i).filter(x => x !== null));
        return; 
    }

    // --- Start Blurry ---
    if (textBox1) {
         body.classList.add('scrollytelling-active');
         // Initially, nothing is focused
         elements.forEach(el => el.classList.remove('scrollytelling-focus'));
    }

   
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -30% 0px', 
        threshold: 0.5                
    };

   
    const setFocus = (elementToFocus) => {
        elements.forEach(el => {
            if (el === elementToFocus) {
                el.classList.add('scrollytelling-focus');
            } else {
                el.classList.remove('scrollytelling-focus');
            }
        });

        if (elements.includes(elementToFocus)) {
             body.classList.add('scrollytelling-active');
        }
    };

    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            const targetElement = entry.target;
            const targetIndex = elements.indexOf(targetElement);

            // --- Logic when Element ENTERS viewport ---
            if (entry.isIntersecting) {
                setFocus(targetElement); 
            }
            // --- Logic when Element EXITS viewport ---
            else {
                 if (targetElement.classList.contains('scrollytelling-focus')) {
                     if (entry.boundingClientRect.top > 0) {
                         if (targetIndex === 0) { 
                             body.classList.remove('scrollytelling-active'); // 
                             targetElement.classList.remove('scrollytelling-focus');
                         } else if (targetIndex > 0) {
                             setFocus(elements[targetIndex - 1]);
                         }
                     }
                     
                     else {
                         if (targetIndex === elements.length - 1) { 
                             body.classList.remove('scrollytelling-active'); 
                             targetElement.classList.remove('scrollytelling-focus');
                         } else {
                         }
                     }
                 }
            }
        });
    }; 

  
    const observer = new IntersectionObserver(observerCallback, observerOptions);

   
    elements.forEach(el => observer.observe(el));

}); 