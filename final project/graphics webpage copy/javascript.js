
document.addEventListener('DOMContentLoaded', () => {
    // --- Select All Elements in the Sequence ---
    const textBox1 = document.querySelector('.text-box-1');
    const chart2 = document.getElementById('chart_2');
    const textBox2 = document.querySelector('.text-box-2');
    const chart1 = document.getElementById('chart_1');
    const textBox3 = document.querySelector('.text-box-3');
    const chart3 = document.getElementById('chart_3');
    const textBox4 = document.querySelector('.text-box-4');
    const body = document.body;

    // --- Store elements in order for easier logic ---
    const elements = [
        textBox1, chart2, textBox2, chart1, textBox3, chart3, textBox4
    ];

    // --- Basic Check ---
    if (elements.some(el => !el)) {
        console.error("Scrollytelling elements not found! Check IDs and classes in HTML.");
        console.log("Missing:", elements.map((el, i) => el ? null : i).filter(x => x !== null));
        return; // Exit if any element is missing
    }

    // --- Start Blurry ---
    // Add blur immediately on load, but only if the first element exists
    if (textBox1) {
         body.classList.add('scrollytelling-active');
         // Initially, nothing is focused
         elements.forEach(el => el.classList.remove('scrollytelling-focus'));
    }

    // --- Intersection Observer Options ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -30% 0px', // Adjust negative bottom margin for timing (-25% to -40%)
        threshold: 0.5                 // Adjust threshold (0.3 to 0.7) for trigger point
    };

    // --- Helper to Set Focus ---
    const setFocus = (elementToFocus) => {
        elements.forEach(el => {
            if (el === elementToFocus) {
                el.classList.add('scrollytelling-focus');
            } else {
                el.classList.remove('scrollytelling-focus');
            }
        });
        // Ensure blur stays active while focusing elements within the sequence
        if (elements.includes(elementToFocus)) {
             body.classList.add('scrollytelling-active');
        }
    };

    // --- Intersection Observer Callback ---
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            const targetElement = entry.target;
            const targetIndex = elements.indexOf(targetElement);

            // --- Logic when Element ENTERS viewport ---
            if (entry.isIntersecting) {
                setFocus(targetElement); // Focus the element that entered
            }
            // --- Logic when Element EXITS viewport ---
            else {
                // Only act if the element leaving *was* the focused one
                 if (targetElement.classList.contains('scrollytelling-focus')) {
                     // Check if scrolling UP (element's top is above viewport top edge when exiting)
                     if (entry.boundingClientRect.top > 0) {
                         // Scrolling UP
                         if (targetIndex === 0) { // Exited TextBox1 going UP
                             body.classList.remove('scrollytelling-active'); // Remove blur completely
                             targetElement.classList.remove('scrollytelling-focus');
                         } else if (targetIndex > 0) {
                             // Re-focus the previous element in the sequence
                             setFocus(elements[targetIndex - 1]);
                         }
                     }
                     // Check if scrolling DOWN (element's top is below viewport top edge when exiting)
                     else {
                         // Scrolling DOWN
                         if (targetIndex === elements.length - 1) { // Exited the LAST element (textBox4) going DOWN
                             body.classList.remove('scrollytelling-active'); // Remove blur completely
                             targetElement.classList.remove('scrollytelling-focus');
                         } else {
                            // As we scroll down past an element, the *next* one entering
                            // the viewport should take focus via the 'isIntersecting' logic.
                            // We can optionally remove focus here explicitly if needed.
                            // targetElement.classList.remove('scrollytelling-focus');
                         }
                     }
                 }
            }
        });
    }; // End of observerCallback

    // --- Create and Start the Observer ---
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements in the sequence
    elements.forEach(el => observer.observe(el));

}); // End DOMContentLoaded event listener