/* =========================================================
   MOBILE SWIPE NAVIGATION

   Introduction
   → About Me
   → Skills
   → Qualification
   → Services
   → Portfolio
   → Contact Me
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const home = document.getElementById("home");
    const vscode = home?.querySelector(".vscode-mini-window");
    const titleLabel = vscode?.querySelector(".vscode-mini-title-label");
    const titleIcon = vscode?.querySelector(".vscode-mini-title-icon");
    const profile = vscode?.querySelector(".profile-card-content");
    const status = vscode?.querySelector(".vscode-mini-status");
    const social = home?.querySelector(".home__social");

    const about = document.getElementById("about");
    const skills = document.getElementById("skills");
    const qualification = document.getElementById("qualification");
    const services = document.getElementById("services");
    const portfolio = document.getElementById("portfolio");
    const contact = document.getElementById("contact");

    if (
        !home ||
        !vscode ||
        !profile ||
        !about ||
        !skills ||
        !qualification ||
        !services ||
        !portfolio ||
        !contact
    ) return;


    /* =====================================================
       MOBILE VS CODE TRAFFIC LIGHT BUTTONS
    ===================================================== */

    const vscodeDots = vscode.querySelectorAll(".vscode-mini-dots span");

    let dontTouchTimer = null;
    let borderTimer = null;

    const trafficLightColors = [
        "#ff5f57",
        "#febc2e",
        "#28c840"
    ];

    vscodeDots.forEach((button, index) => {

        button.style.cursor = "pointer";
        button.setAttribute("role", "button");

        button.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            vscode.querySelectorAll(".dont-touch-border")
                .forEach(el => el.remove());

            clearTimeout(borderTimer);

            const border = document.createElement("div");
            border.className = "dont-touch-border";

            border.style.setProperty(
                "--border-color",
                trafficLightColors[index]
            );

            vscode.appendChild(border);

            borderTimer = setTimeout(() => {
                border.remove();
            }, 4100);

            if (index === 0) {

                document.querySelectorAll(".dont-touch-message")
                    .forEach(el => el.remove());

                clearTimeout(dontTouchTimer);

                const rect = button.getBoundingClientRect();

                const message = document.createElement("div");

                message.className = "dont-touch-message";
                message.textContent = "Don't Touch Me!";

                message.style.left =
                    `${rect.left + rect.width / 2}px`;

                message.style.top =
                    `${rect.top + rect.height / 2}px`;

                document.body.appendChild(message);

                dontTouchTimer = setTimeout(() => {
                    message.remove();
                }, 2200);
            }

        });

    });


    /* =====================================================
       VARIABLES
    ===================================================== */

    const mobile = window.matchMedia("(max-width: 767px)");

    let frame = null;

    let profilePane = null;
    let aboutPane = null;
    let skillsPane = null;
    let qualificationPane = null;
    let servicesPane = null;
    let portfolioPane = null;
    let contactPane = null;

    let portfolioGesture = false;

    let profileHeader = null;
    let profileHeading = null;
    let originalProfileDescription = null;
    let mobileProfileDescription = null;

    let mobileServiceModals = [];

    let startX = 0;
    let startY = 0;

    let activeView = null;


    /* =====================================================
       SETUP MOBILE PANELS
    ===================================================== */

    function setup() {

        if (frame || !mobile.matches) return;

        /* Move social icons inside VS Code window */

        if (social && social.parentNode !== vscode) {
            vscode.insertBefore(social, status);
        }


        /* Create main frame */

        frame = document.createElement("div");
        frame.className = "vscode-mobile-content";


        /* Create all seven panels */

        profilePane = document.createElement("div");
        profilePane.className = "vscode-mobile-profile";

        aboutPane = document.createElement("div");
        aboutPane.className = "vscode-mobile-about";

        skillsPane = document.createElement("div");
        skillsPane.className = "vscode-mobile-skills";

        qualificationPane = document.createElement("div");
        qualificationPane.className = "vscode-mobile-qualification";

        servicesPane = document.createElement("div");
        servicesPane.className = "vscode-mobile-services";

        portfolioPane = document.createElement("div");
        portfolioPane.className = "vscode-mobile-portfolio";

        contactPane = document.createElement("div");
        contactPane.className = "vscode-mobile-contact";


        /* =================================================
           INTRODUCTION PANEL
        ================================================= */

        profileHeading = profile.querySelector(".profile-card-heading");

        if (profileHeading) {

            profileHeader = document.createElement("div");
            profileHeader.className = "vscode-mobile-profile-header";

            profileHeader.appendChild(profileHeading);
        }

        profile.classList.add("vscode-mobile-profile-card");

        /* Save original typing animation paragraph */

        originalProfileDescription = profile.querySelector(
            ".profile-card-description"
        );

        if (originalProfileDescription) {

            /* Create static mobile introduction */

            mobileProfileDescription = document.createElement("p");

            mobileProfileDescription.className =
                "home__description drop-cap1";

            mobileProfileDescription.textContent =
                "I am an Object Oriented Programmer, Highly skilled in Frontend & Backend Development with latest technologies including Data Science, Machine Learning, Artificial Intelligence, Bigdata and Blockchain.";

            /* Replace typing animation only on mobile */

            originalProfileDescription.replaceWith(mobileProfileDescription);
        }

        profilePane.appendChild(profile);


        /* =================================================
           ABOUT ME PANEL
        ================================================= */

        const aboutHeading = about.querySelector(".section__title");
        const aboutSubtitle = about.querySelector(".section__subtitle");
        const aboutContainer = about.querySelector(".about__container");

        if (aboutHeading) {
            aboutPane.appendChild(aboutHeading.cloneNode(true));
        }

        if (aboutSubtitle) {
            aboutPane.appendChild(aboutSubtitle.cloneNode(true));
        }

        if (aboutContainer) {

            const aboutCopy = aboutContainer.cloneNode(true);

            const swiper = aboutCopy.querySelector(
                ".swiper-container-about-me"
            );

            if (swiper) {

                const img = swiper.querySelector("img");

                if (img) {

                    const image = img.cloneNode(true);
                    image.className = "about__image-mobile";

                    aboutCopy.insertBefore(image, aboutCopy.firstChild);
                }

                swiper.remove();
            }

            aboutPane.appendChild(aboutCopy);
        }


        /* =================================================
           SKILLS PANEL
        ================================================= */

        const skillsCopy = skills.cloneNode(true);

        const skillsHeading = skillsCopy.querySelector(".section__title");

        if (skillsHeading) {
            skillsHeading.remove();
        }

        const skillsSubtitle = skillsCopy.querySelector(".section__subtitle");

        if (skillsSubtitle) {
            skillsSubtitle.remove();
        }

        skillsPane.appendChild(skillsCopy);
/* =================================================
   MOBILE SKILLS — ANIMATED HORIZONTAL BARS
================================================= */

skillsPane.querySelectorAll(".skills__data").forEach(item => {

    const number = item.querySelector(".skills__number");
    const track = item.querySelector(".skills_bar");
    const fill = item.querySelector(".skills__percentage");

    if (!number || !track || !fill) return;

    const original = Math.max(
        0,
        Math.min(100, parseInt(number.textContent, 10) || 0)
    );

    const minValue = Math.max(0, original - 5);
    const maxValue = Math.min(100, original + 5);

    let from = original;
    let to = maxValue;
    let direction = 1;
    let startedAt = null;

    // Initial visible state
    fill.style.setProperty("width", `${original}%`, "important");
    fill.style.setProperty("background-color", "#22c55e", "important");

    number.textContent = `${original}%`;

    function animateMobileSkill(timestamp) {

        if (startedAt === null) startedAt = timestamp;

        const progress = Math.min(
            (timestamp - startedAt) / 1800,
            1
        );

        const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const value = from + (to - from) * eased;

        fill.style.setProperty(
            "width",
            `${value}%`,
            "important"
        );

        fill.style.setProperty(
            "background-color",
            direction === 1 ? "#22c55e" : "#ef4444",
            "important"
        );

        number.textContent = `${Math.round(value)}%`;

        if (progress >= 1) {

            direction *= -1;

            from = to;

            to = direction === 1
                ? maxValue
                : minValue;

            startedAt = timestamp;
        }

        requestAnimationFrame(animateMobileSkill);
    }

    requestAnimationFrame(animateMobileSkill);

});

        /* Skills accordion */

        skillsPane.querySelectorAll(".skills__header").forEach(header => {

            header.addEventListener("click", function () {

                const parent = this.parentNode;

                const isClosed = parent.classList.contains("skills__close");

                skillsPane.querySelectorAll(".skills__content").forEach(item => {

                    item.classList.remove("skills__open");
                    item.classList.add("skills__close");

                });

                if (isClosed) {

                    parent.classList.remove("skills__close");
                    parent.classList.add("skills__open");

                }

            });

        });


        /* =================================================
           QUALIFICATION PANEL
        ================================================= */

        const qualificationCopy = qualification.cloneNode(true);

        const qualificationHeading =
            qualificationCopy.querySelector(".section__title");

        if (qualificationHeading) {
            qualificationHeading.remove();
        }

        const qualificationSubtitle =
            qualificationCopy.querySelector(".section__subtitle");

        if (qualificationSubtitle) {
            qualificationSubtitle.remove();
        }

        qualificationPane.appendChild(qualificationCopy);


        /* Qualification tabs */

        const qualificationTabs =
            qualificationPane.querySelectorAll("[data-target]");

        const qualificationContents =
            qualificationPane.querySelectorAll("[data-content]");

        qualificationTabs.forEach(tab => {

            tab.addEventListener("click", function (event) {

                event.preventDefault();

                const targetSelector = tab.dataset.target;

                if (!targetSelector) return;

                const target = qualificationCopy.querySelector(targetSelector);

                if (!target) return;

                qualificationContents.forEach(content => {
                    content.classList.remove("qualification__active");
                });

                target.classList.add("qualification__active");

                qualificationTabs.forEach(item => {
                    item.classList.remove("qualification__active");
                });

                tab.classList.add("qualification__active");

            });

        });


        /* =================================================
           SERVICES PANEL
        ================================================= */

        const servicesCopy = services.cloneNode(true);

        const servicesHeading =
            servicesCopy.querySelector(".section__title");

        if (servicesHeading) {
            servicesHeading.remove();
        }

        const servicesSubtitle =
            servicesCopy.querySelector(".section__subtitle");

        if (servicesSubtitle) {
            servicesSubtitle.remove();
        }

        servicesPane.appendChild(servicesCopy);


        /* =================================================
           MOBILE SERVICES POPUP
        ================================================= */

        const mobileServiceButtons =
            servicesPane.querySelectorAll(".services__button");

        mobileServiceModals = Array.from(
            servicesPane.querySelectorAll(".services__modal")
        );


        /* macOS traffic light controls */

        mobileServiceModals.forEach(modal => {

            const modalContent = modal.querySelector(
                ".services__modal-content"
            );

            if (!modalContent) return;

            modalContent.querySelector(".services__modal-close")?.remove();

            if (modalContent.querySelector(".mac-window-controls")) return;

            const controls = document.createElement("div");
            controls.className = "mac-window-controls";

            controls.innerHTML = `
                <button class="mac-close" type="button"
                        aria-label="Close popup"></button>
                <span class="mac-minimize"></span>
                <span class="mac-maximize"></span>
            `;

            modalContent.appendChild(controls);

            controls.querySelector(".mac-close").addEventListener("click", () => {
                modal.classList.remove("active-modal");
            });

        });


        /* Move modals outside transformed panel */

        mobileServiceModals.forEach(modal => {

            modal.classList.add("mobile-service-modal");

            document.body.appendChild(modal);

        });


        /* Open service popup */

        mobileServiceButtons.forEach((button, index) => {

            button.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                mobileServiceModals.forEach(modal => {
                    modal.classList.remove("active-modal");
                });

                const selectedModal = mobileServiceModals[index];

                if (selectedModal) {
                    selectedModal.classList.add("active-modal");
                }

            });

        });


        /* Close popup */

        mobileServiceModals.forEach(modal => {

            modal.addEventListener("click", function (event) {

                if (event.target.closest(".services__modal-close")) {

                    event.preventDefault();
                    event.stopPropagation();

                    modal.classList.remove("active-modal");

                    return;
                }

                if (event.target === modal) {

                    modal.classList.remove("active-modal");

                }

            });

        });


        /* =================================================
           PORTFOLIO PANEL
           Native mobile carousel
        ================================================= */

        const portfolioSubtitle = portfolio.querySelector(".section__subtitle");

        const portfolioOriginalContainer =
            portfolio.querySelector(".portfolio__container");

        if (portfolioSubtitle) {
            portfolioPane.appendChild(portfolioSubtitle.cloneNode(true));
        }

        if (portfolioOriginalContainer) {

            const portfolioCopy = portfolioOriginalContainer.cloneNode(true);

            portfolioCopy.classList.remove(
                "swiper",
                "mySwiper",
                "swiper-initialized",
                "swiper-horizontal",
                "swiper-backface-hidden"
            );

            portfolioCopy.classList.add("mobile-portfolio-slider");

            portfolioCopy.removeAttribute("style");

            const track = portfolioCopy.querySelector(".swiper-wrapper");

            if (track) {

                track.classList.remove("swiper-wrapper");
                track.classList.add("mobile-portfolio-track");

                track.removeAttribute("style");

                /* Remove duplicate Swiper slides */

                track.querySelectorAll(".swiper-slide-duplicate").forEach(slide => {
                    slide.remove();
                });

                /* Convert slides into mobile cards */

                track.querySelectorAll(".swiper-slide").forEach(slide => {

                    slide.classList.remove(
                        "swiper-slide",
                        "swiper-slide-active",
                        "swiper-slide-next",
                        "swiper-slide-prev"
                    );

                    slide.classList.add("mobile-portfolio-card");

                    slide.removeAttribute("style");

                });

            }

            /* Remove desktop navigation */

            portfolioCopy.querySelectorAll(
                ".swiper-button-next, .swiper-button-prev, .swiper-pagination"
            ).forEach(control => control.remove());

            /* Create mobile controls */

            const controls = document.createElement("div");

            controls.className = "mobile-portfolio-controls";

            controls.innerHTML = `
                <button type="button"
                        class="mobile-portfolio-prev"
                        aria-label="Previous project">
                    <i class="uil uil-angle-left-b"></i>
                </button>

                <div class="mobile-portfolio-dots"
                     aria-label="Project pagination"></div>

                <button type="button"
                        class="mobile-portfolio-next"
                        aria-label="Next project">
                    <i class="uil uil-angle-right-b"></i>
                </button>
            `;

            portfolioCopy.appendChild(controls);

            portfolioPane.appendChild(portfolioCopy);

            /* Slider elements */

            const slides = Array.from(
                portfolioCopy.querySelectorAll(".mobile-portfolio-card")
            );

            const dotsContainer =
                controls.querySelector(".mobile-portfolio-dots");

            const previousButton =
                controls.querySelector(".mobile-portfolio-prev");

            const nextButton =
                controls.querySelector(".mobile-portfolio-next");

            /* Create pagination dots */

            slides.forEach((slide, index) => {

                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "mobile-portfolio-dot";

                dot.setAttribute(
                    "aria-label",
                    `Go to project ${index + 1}`
                );

                dot.addEventListener("click", () => {

                    slides[index].scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "start"
                    });

                });

                dotsContainer.appendChild(dot);

            });

            const dots = Array.from(dotsContainer.children);

            /* Update slider controls */

            function updatePortfolioControls() {

                if (!slides.length || !track) return;

                const sliderRect = track.getBoundingClientRect();

                let activeIndex = 0;
                let smallestDistance = Infinity;

                slides.forEach((slide, index) => {

                    const distance = Math.abs(
                        slide.getBoundingClientRect().left - sliderRect.left
                    );

                    if (distance < smallestDistance) {

                        smallestDistance = distance;
                        activeIndex = index;

                    }

                });

                dots.forEach((dot, index) => {

                    dot.classList.toggle(
                        "is-active",
                        index === activeIndex
                    );

                });

                previousButton.disabled = activeIndex === 0;

                nextButton.disabled = activeIndex === slides.length - 1;

            }

            /* Previous project */

            previousButton.addEventListener("click", () => {

                const current = dots.findIndex(dot =>
                    dot.classList.contains("is-active")
                );

                slides[Math.max(0, current - 1)]?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "start"
                });

            });

            /* Next project */

            nextButton.addEventListener("click", () => {

                const current = dots.findIndex(dot =>
                    dot.classList.contains("is-active")
                );

                slides[Math.min(slides.length - 1, current + 1)]?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "start"
                });

            });

            /* Update controls during scrolling */

            track.addEventListener(
                "scroll",
                updatePortfolioControls,
                { passive: true }
            );

            requestAnimationFrame(updatePortfolioControls);

        }


        /* =================================================
           CONTACT ME PANEL
           Mobile-only clone of original Contact section
        ================================================= */

        const contactSubtitle = contact.querySelector(".section__subtitle");
        const contactContainer = contact.querySelector(".contact__container");

        /* Contact Me heading is shown in the title bar,
           so it is intentionally not cloned here. */

        if (contactSubtitle) {
            contactPane.appendChild(contactSubtitle.cloneNode(true));
        }

        if (contactContainer) {

            const contactCopy = contactContainer.cloneNode(true);

            contactCopy.classList.add("mobile-contact-container");

            /* Make phone and email clickable */

            contactCopy.querySelectorAll(".contact__information").forEach(info => {

                const title = info.querySelector(".contact__title")
                    ?.textContent.trim().toLowerCase();

                const value = info.querySelector(".contact__subtitle")
                    ?.textContent.trim();

                const subtitle = info.querySelector(".contact__subtitle");

                if (!value || !subtitle) return;

                if (title === "call me") {

                    const link = document.createElement("a");

                    link.href = `tel:${value.replace(/[^+\d]/g, "")}`;
                    link.textContent = value;
                    link.className = "mobile-contact-link";

                    subtitle.replaceWith(link);

                } else if (title === "email") {

                    const link = document.createElement("a");

                    link.href = `mailto:${value}`;
                    link.textContent = value;
                    link.className = "mobile-contact-link";

                    subtitle.replaceWith(link);

                }

            });

            /* Improve form labels and placeholders */

            const contactForm = contactCopy.querySelector(".contact__form");

            if (contactForm) {

                contactForm.querySelectorAll(".contact__content").forEach((field, index) => {

                    const input = field.querySelector("input, textarea");
                    const label = field.querySelector("label");

                    if (input && label) {

                        const fieldId = `mobile-contact-field-${index}`;

                        input.id = fieldId;
                        label.htmlFor = fieldId;

                        input.placeholder = label.textContent.trim();

                    }

                });

            }

            contactPane.appendChild(contactCopy);

        }


        /* =================================================
           APPEND ALL SEVEN PANELS
        ================================================= */

        frame.append(
            profilePane,
            aboutPane,
            skillsPane,
            qualificationPane,
            servicesPane,
            portfolioPane,
            contactPane
        );

        /* Insert permanent identity header */

        if (profileHeader) {

            vscode.insertBefore(
                profileHeader,
                social || status || null
            );

        }

        /* Insert swipe frame */

        vscode.insertBefore(
            frame,
            social || status || null
        );


        /* =====================================================
           UNIFIED PANEL SLIDE TRANSITION
           Same left/right animation for all seven panels.
        ===================================================== */

        const mobilePanels = [
            { name: "intro", title: "Introduction", icon: "uil-estate", getElement: () => profilePane },
            { name: "about", title: "About Me", icon: "uil-user", getElement: () => aboutPane },
            { name: "skills", title: "Skills", icon: "uil-brackets-curly", getElement: () => skillsPane },
            { name: "qualification", title: "Qualification", icon: "uil-graduation-cap", getElement: () => qualificationPane },
            { name: "services", title: "Services", icon: "uil-briefcase-alt", getElement: () => servicesPane },
            { name: "portfolio", title: "Portfolio", icon: "uil-folder", getElement: () => portfolioPane },
            { name: "contact", title: "Contact Me", icon: "uil-envelope", getElement: () => contactPane }
        ];

        const PANEL_TRANSITION_MS = 400;
        const PANEL_EASING = "cubic-bezier(0.22, 0.75, 0.25, 1)";

        let panelAnimationTimer = null;
        let panelAnimating = false;


        function closeServicePopups() {

            mobileServiceModals.forEach(modal => {
                modal.classList.remove("active-modal");
            });

        }


        function showPanel(viewName) {

            if (!frame || panelAnimating) return;

            const nextIndex = mobilePanels.findIndex(
                panel => panel.name === viewName
            );

            if (nextIndex === -1) return;

            // Show/hide navigation arrows according to the current page.

            if (leftArrow && rightArrow) {

                // First page: only right arrow
                if (nextIndex === 0) {
                    leftArrow.style.display = "none";
                    rightArrow.style.display = "flex";
                }

                // Last page: only left arrow
                else if (nextIndex === mobilePanels.length - 1) {
                    leftArrow.style.display = "flex";
                    rightArrow.style.display = "none";
                }

                // Middle pages: both arrows
                else {
                    leftArrow.style.display = "flex";
                    rightArrow.style.display = "flex";
                }

            }

            const nextPanel = mobilePanels[nextIndex].getElement();

            if (!nextPanel) return;

            // Keep the fixed swipe hints in sync with the panel being displayed.

            const swipeHint = document.querySelector(".mobile-swipe-hint");

            if (swipeHint) {
                swipeHint.setAttribute("data-active-view", viewName);
            }

            const previousIndex = mobilePanels.findIndex(
                panel => panel.name === activeView
            );

            const currentPanel = previousIndex >= 0
                ? mobilePanels[previousIndex].getElement()
                : null;

            window.clearTimeout(panelAnimationTimer);

            closeServicePopups();

            /* Update title text */

            if (titleLabel) {
                titleLabel.textContent = mobilePanels[nextIndex].title;
            }

            /* Update title icon */

            if (titleIcon) {
                titleIcon.className =
                    `vscode-mini-title-icon uil ${mobilePanels[nextIndex].icon}`;
            }

            /* First display: show Introduction without animation */

            if (!currentPanel) {

                mobilePanels.forEach((panel, index) => {

                    const element = panel.getElement();

                    if (!element) return;

                    element.style.transition = "none";

                    element.style.visibility =
                        index === nextIndex ? "visible" : "hidden";

                    element.style.pointerEvents =
                        index === nextIndex ? "auto" : "none";

                    element.style.zIndex =
                        index === nextIndex ? "2" : "0";

                    element.style.opacity =
                        index === nextIndex ? "1" : "0";

                    element.style.transform =
                        "translate3d(0, 0, 0)";

                });

                activeView = viewName;

                return;
            }

            if (previousIndex === nextIndex) return;

            panelAnimating = true;

            /* Forward: enter from right.
               Backward: enter from left. */

            const direction = nextIndex > previousIndex ? 1 : -1;

            nextPanel.style.transition = "none";
            nextPanel.style.visibility = "visible";
            nextPanel.style.pointerEvents = "auto";
            nextPanel.style.zIndex = "2";
            nextPanel.style.opacity = "0";

            nextPanel.style.transform =
                `translate3d(${direction * 100}%, 0, 0)`;

            currentPanel.style.transition = "none";
            currentPanel.style.visibility = "visible";
            currentPanel.style.pointerEvents = "none";
            currentPanel.style.zIndex = "1";
            currentPanel.style.opacity = "1";

            currentPanel.style.transform =
                "translate3d(0, 0, 0)";

            /* Apply starting positions before transition */

            void nextPanel.offsetWidth;

            requestAnimationFrame(() => {

                const transition = [
                    `transform ${PANEL_TRANSITION_MS}ms ${PANEL_EASING}`,
                    `opacity ${PANEL_TRANSITION_MS}ms ease`
                ].join(", ");

                /* Incoming panel */

                nextPanel.style.transition = transition;

                nextPanel.style.transform =
                    "translate3d(0, 0, 0)";

                nextPanel.style.opacity = "1";

                /* Outgoing panel */

                currentPanel.style.transition = transition;

                currentPanel.style.transform =
                    `translate3d(${-direction * 100}%, 0, 0)`;

                currentPanel.style.opacity = "0";

            });

            activeView = viewName;

            /* Finalize transition */

            panelAnimationTimer = window.setTimeout(() => {

                mobilePanels.forEach((panel, index) => {

                    const element = panel.getElement();

                    if (!element) return;

                    const isActive = index === nextIndex;

                    element.style.transition = "none";

                    element.style.visibility =
                        isActive ? "visible" : "hidden";

                    element.style.pointerEvents =
                        isActive ? "auto" : "none";

                    element.style.zIndex =
                        isActive ? "2" : "0";

                    element.style.opacity =
                        isActive ? "1" : "0";

                    element.style.transform =
                        "translate3d(0, 0, 0)";

                });

                panelAnimating = false;

            }, PANEL_TRANSITION_MS + 50);

        }


        /* =====================================================
           PANEL NAVIGATION FUNCTIONS
        ===================================================== */

        function showIntroduction() {
            showPanel("intro");
        }

        function showAbout() {
            showPanel("about");
        }

        function showSkills() {
            showPanel("skills");
        }

        function showQualification() {
            showPanel("qualification");
        }

        function showServices() {
            showPanel("services");
        }

        function showPortfolio() {
            showPanel("portfolio");
        }

        function showContact() {
            showPanel("contact");
        }


        /* =====================================================
           MOBILE LEFT / RIGHT NAVIGATION ARROWS
        ===================================================== */

        const leftArrow = document.createElement("button");
        const rightArrow = document.createElement("button");

        leftArrow.className = "vscode-side-arrow vscode-left-arrow";
        rightArrow.className = "vscode-side-arrow vscode-right-arrow";

        leftArrow.innerHTML = "&#10094;";
        rightArrow.innerHTML = "&#10095;";

        leftArrow.setAttribute("aria-label", "Previous panel");
        rightArrow.setAttribute("aria-label", "Next panel");

        vscode.append(leftArrow, rightArrow);

        leftArrow.addEventListener("click", () => {

            const currentIndex = mobilePanels.findIndex(
                panel => panel.name === activeView
            );

            const previousIndex =
                (currentIndex - 1 + mobilePanels.length) % mobilePanels.length;

            showPanel(mobilePanels[previousIndex].name);

        });

        rightArrow.addEventListener("click", () => {

            const currentIndex = mobilePanels.findIndex(
                panel => panel.name === activeView
            );

            const nextIndex =
                (currentIndex + 1) % mobilePanels.length;

            showPanel(mobilePanels[nextIndex].name);

        });


        /* Show Introduction initially */

        showIntroduction();


        /* =====================================================
           TOUCH START
        ===================================================== */

        function touchStart(event) {

            if (!mobile.matches || !frame || panelAnimating) return;

            /* Portfolio slider handles its own horizontal gestures */

            portfolioGesture = !!event.target.closest(
                ".mobile-portfolio-slider"
            );

            startX = event.changedTouches[0].clientX;
            startY = event.changedTouches[0].clientY;

        }


        /* =====================================================
           TOUCH END
        ===================================================== */

        function touchEnd(event) {

            if (!mobile.matches || !frame || panelAnimating) return;

            /* Let Portfolio carousel handle its own gestures */

            if (portfolioGesture) {

                portfolioGesture = false;

                return;

            }

            /* Do not navigate while a service popup is open */

            if (
                mobileServiceModals.some(modal =>
                    modal.classList.contains("active-modal")
                )
            ) {
                return;
            }

            const endX = event.changedTouches[0].clientX;
            const endY = event.changedTouches[0].clientY;

            const diffX = endX - startX;
            const diffY = endY - startY;

            /* Ignore vertical swipes and small movements */

            if (
                Math.abs(diffX) < 55 ||
                Math.abs(diffX) < Math.abs(diffY) * 1.2
            ) {
                return;
            }


            /* =================================================
               SWIPE LEFT: NEXT PANEL
               Contact Me → Introduction (Loop)
            ================================================= */

            if (diffX < 0 && activeView === "intro") {

                showAbout();

            }

            else if (diffX < 0 && activeView === "about") {

                showSkills();

            }

            else if (diffX < 0 && activeView === "skills") {

                showQualification();

            }

            else if (diffX < 0 && activeView === "qualification") {

                showServices();

            }

            else if (diffX < 0 && activeView === "services") {

                showPortfolio();

            }

            else if (diffX < 0 && activeView === "portfolio") {

                showContact();

            }

            else if (diffX < 0 && activeView === "contact") {

                showIntroduction();

            }


            /* =================================================
               SWIPE RIGHT: PREVIOUS PANEL
               Introduction → Contact Me (Loop)
            ================================================= */

            else if (diffX > 0 && activeView === "contact") {

                showPortfolio();

            }

            else if (diffX > 0 && activeView === "portfolio") {

                showServices();

            }

            else if (diffX > 0 && activeView === "services") {

                showQualification();

            }

            else if (diffX > 0 && activeView === "qualification") {

                showSkills();

            }

            else if (diffX > 0 && activeView === "skills") {

                showAbout();

            }

            else if (diffX > 0 && activeView === "about") {

                showIntroduction();

            }

            else if (diffX > 0 && activeView === "intro") {

                showContact();

            }

        }


        /* Attach touch events to the mobile frame */

        frame.addEventListener("touchstart", touchStart, {
            passive: true
        });

        frame.addEventListener("touchend", touchEnd, {
            passive: true
        });

    }


    /* =====================================================
       RESTORE DESKTOP LAYOUT
    ===================================================== */

    function restore() {

        if (!frame) return;

        /* Close and remove mobile popup windows */

        mobileServiceModals.forEach(modal => {

            modal.classList.remove("active-modal");
            modal.remove();

        });

        mobileServiceModals = [];

        /* Restore original profile position */

        if (status) {
            vscode.insertBefore(profile, status);
        }

        /* Restore original typing animation for desktop */

        if (originalProfileDescription && mobileProfileDescription) {

            mobileProfileDescription.replaceWith(originalProfileDescription);

            originalProfileDescription = null;
            mobileProfileDescription = null;

        }

        /* Restore original profile heading */

        if (profileHeading) {

            profile.insertBefore(
                profileHeading,
                profile.firstChild
            );

        }

        /* Remove mobile profile header */

        profileHeader?.remove();

        profileHeader = null;
        profileHeading = null;

        /* Remove mobile frame */

        vscode.querySelectorAll(".vscode-side-arrow").forEach(arrow => {
            arrow.remove();
        });

        frame.remove();

        frame = null;

        profilePane = null;
        aboutPane = null;
        skillsPane = null;
        qualificationPane = null;
        servicesPane = null;
        portfolioPane = null;
        contactPane = null;

        /* Remove mobile-only profile class */

        profile.classList.remove("vscode-mobile-profile-card");

        activeView = null;

    }


    /* =====================================================
       MOBILE / DESKTOP MODE CHANGE
    ===================================================== */

    function modeChange() {

        if (mobile.matches) {

            setup();

        } else {

            restore();

        }

    }


    /* =====================================================
       EVENT LISTENERS
    ===================================================== */

    window.addEventListener("resize", modeChange);

    if (mobile.addEventListener) {

        mobile.addEventListener("change", modeChange);

    } else {

        mobile.addListener(modeChange);

    }


    /* =====================================================
       DESKTOP SCROLL: INTRODUCTION <-> ABOUT ME
       Scrolling down inside the full-screen VS Code window opens
       About Me. Scrolling up returns to Introduction.
    ===================================================== */
    /* =====================================================
       DESKTOP NAVIGATION:
       INTRODUCTION → ABOUT ME → SKILLS → QUALIFICATION
    ===================================================== */

    const desktop = window.matchMedia("(min-width: 1025px)");

    let desktopAboutView = null;
    let desktopSkillsView = null;
    let desktopQualificationView = null;
    let desktopServicesView = null;
    let desktopPortfolioView = null;
    let desktopContactView = null;

    let desktopViewIndex = 0;

    // 0 = Introduction
    // 1 = About Me
    // 2 = Skills
    // 3 = Qualification
    // 4 = Services

    let desktopWheelLocked = false;
    let desktopProfileHeadingHost = null;

    const originalDesktopProfileHeading =
        profile.querySelector(".profile-card-heading");


    /* =====================================================
       KEEP PROFILE HEADING PERMANENTLY VISIBLE
    ===================================================== */

    function setupDesktopProfileHeading() {

        if (
            !desktop.matches ||
            !originalDesktopProfileHeading ||
            desktopProfileHeadingHost
        ) return;

        desktopProfileHeadingHost = document.createElement("div");

        desktopProfileHeadingHost.className =
            "vscode-desktop-profile-heading-host";

        desktopProfileHeadingHost.appendChild(
            originalDesktopProfileHeading
        );

        vscode.insertBefore(
            desktopProfileHeadingHost,
            profile
        );

    }


    function restoreDesktopProfileHeading() {

        if (
            !desktopProfileHeadingHost ||
            !originalDesktopProfileHeading
        ) return;

        profile.insertBefore(
            originalDesktopProfileHeading,
            profile.firstChild
        );

        desktopProfileHeadingHost.remove();

        desktopProfileHeadingHost = null;

    }


    /* =====================================================
       CREATE ABOUT ME VIEW
    ===================================================== */

    function createDesktopAboutView() {

        if (desktopAboutView) return;

        desktopAboutView = document.createElement("div");

        desktopAboutView.className =
            "vscode-desktop-about-view";

        const content = about.querySelector(".about__container");

        if (content) {

            const aboutContent = content.cloneNode(true);

            const swiper = aboutContent.querySelector(
                ".swiper-container-about-me"
            );

            if (swiper) {

                const sourceImage = swiper.querySelector("img");

                if (sourceImage) {

                    const image = sourceImage.cloneNode(true);

                    image.classList.add("vscode-about-visual");

                    image.removeAttribute("style");

                    swiper.replaceWith(image);

                } else {

                    swiper.remove();

                }

            }

            desktopAboutView.appendChild(aboutContent);

        }

        vscode.insertBefore(
            desktopAboutView,
            status
        );

    }


    /* =====================================================
       CREATE SKILLS VIEW
    ===================================================== */

    function createDesktopSkillsView() {

        if (desktopSkillsView) return;

        desktopSkillsView = document.createElement("div");

        desktopSkillsView.className =
            "vscode-desktop-skills-view";

        const sourceContainer = skills.querySelector(
            ".skills__container"
        );

        if (sourceContainer) {

            const skillsContent = sourceContainer.cloneNode(true);

            // Add technology logos before every skill name.

            if (!document.querySelector("#devicon-stylesheet")) {

                const iconStyles = document.createElement("link");

                iconStyles.id = "devicon-stylesheet";
                iconStyles.rel = "stylesheet";

                iconStyles.href =
                    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css";

                document.head.appendChild(iconStyles);

            }

            const skillIconMap = {
                "HTML": "devicon-html5-plain colored",
                "CSS": "devicon-css3-plain colored",
                "JavaScript": "devicon-javascript-plain colored",
                "Flask": "devicon-flask-original",
                "Python": "devicon-python-plain colored",
                "CoreJava": "devicon-java-plain colored",
                "C": "devicon-c-plain colored",
                "NodeJS": "devicon-nodejs-plain colored",
                "Machine Learning": "devicon-pytorch-original colored",
                "Natural Language Processing": "devicon-python-plain colored",
                "Hadoop": "devicon-hadoop-plain colored"
            };

            skillsContent.querySelectorAll(".skills__name").forEach(name => {

                const skillName = name.textContent.trim();

                const icon = document.createElement("i");

                if (skillIconMap[skillName]) {
                    icon.className = skillIconMap[skillName];
                } else {
                    icon.className = "uil uil-file-alt";
                }

                icon.classList.add("skill-tech-icon");
                icon.setAttribute("aria-hidden", "true");

                name.prepend(icon);

            });

            skillsContent.classList.add(
                "vscode-desktop-skills-container"
            );

            // Expand all four skill categories.

            skillsContent.querySelectorAll(".skills__content").forEach(item => {

                item.classList.remove("skills__close");
                item.classList.add("skills__open");

            });


            // Convert percentages into circular indicators.

           // Convert percentages into animated circular indicators.

// Convert percentages into animated circular indicators.
// =========================================================
// SKILLS — ANIMATED DESKTOP CIRCLES + MOBILE BARS
// =========================================================

const isDesktopSkills = window.matchMedia("(min-width: 1025px)");

skillsContent.querySelectorAll(".skills__data").forEach(item => {

    const number = item.querySelector(".skills__number");
    const bar = item.querySelector(".skills_bar");
    const fill = item.querySelector(".skills__percentage");

    if (!number || !bar || !fill) return;

    // Preserve original percentage
    const originalPercentage = Math.max(
        0,
        Math.min(100, parseInt(number.textContent, 10) || 0)
    );

    const minPercentage = Math.max(0, originalPercentage - 5);
    const maxPercentage = Math.min(100, originalPercentage + 5);

    const duration = 1800;

    let startTime = null;
    let direction = 1;

    let startPercentage = originalPercentage;
    let targetPercentage = maxPercentage;

    // Initial values
    bar.setAttribute("data-percent", `${originalPercentage}%`);

    bar.style.setProperty(
        "--skill-percent",
        originalPercentage
    );

    function animatePercentage(timestamp) {

        if (!startTime) startTime = timestamp;

        const progress = Math.min(
            (timestamp - startTime) / duration,
            1
        );

        // Smooth ease-in-out
        const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const currentPercentage =
            startPercentage +
            (targetPercentage - startPercentage) * eased;

        const displayedPercentage = Math.round(currentPercentage);

        // GREEN while increasing, RED while decreasing
        const skillColor = direction === 1
            ? "#22c55e"
            : "#ef4444";

        if (isDesktopSkills.matches) {

            // DESKTOP: Circular percentage graph

            bar.style.setProperty(
                "--skill-percent",
                currentPercentage
            );

            bar.style.setProperty(
                "--skill-color",
                skillColor
            );

            bar.setAttribute(
                "data-percent",
                `${displayedPercentage}%`
            );

        } else {

            // MOBILE / TABLET: Horizontal percentage bar

            fill.style.setProperty(
                "width",
                `${currentPercentage}%`,
                "important"
            );

            fill.style.setProperty(
                "background-color",
                skillColor,
                "important"
            );

            number.textContent = `${displayedPercentage}%`;

        }

        // Reverse direction at the endpoint
        if (progress >= 1) {

            direction *= -1;

            startPercentage = targetPercentage;

            targetPercentage = direction === 1
                ? maxPercentage
                : minPercentage;

            startTime = timestamp;
        }

        requestAnimationFrame(animatePercentage);
    }

    requestAnimationFrame(animatePercentage);

});


            // Create slider viewport.

            const slider = document.createElement("div");

            slider.className = "desktop-skills-slider";


            // Create sliding track.

            const track = document.createElement("div");

            track.className = "desktop-skills-track";


            // Move all four skill cards into the track.

            const cards = Array.from(
                skillsContent.querySelectorAll(".skills__content")
            );

            cards.forEach(card => {

                track.appendChild(card);

                // Create unique dual-colour neon border for Skills cards.

                const border = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                );

                border.setAttribute("aria-hidden", "true");

                border.classList.add("skills-neon-border");

                const rectClasses = [
                    "skills-neon-track",
                    "skills-neon-glow",
                    "skills-neon-cyan",
                    "skills-neon-violet"
                ];

                const rects = [];

                rectClasses.forEach(className => {

                    const rect = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "rect"
                    );

                    rect.setAttribute("pathLength", "100");
                    rect.setAttribute("vector-effect", "non-scaling-stroke");

                    rect.classList.add(className);

                    border.appendChild(rect);

                    rects.push(rect);

                });

                card.appendChild(border);

                // Match SVG border to actual card dimensions.

                const updateSkillsBorder = () => {

                    const width = card.clientWidth;
                    const height = card.clientHeight;

                    if (!width || !height) return;

                    const radius = parseFloat(
                        getComputedStyle(card).borderTopLeftRadius
                    ) || 20;

                    border.setAttribute(
                        "viewBox",
                        `0 0 ${width} ${height}`
                    );

                    rects.forEach(rect => {

                        rect.setAttribute("x", "1.5");
                        rect.setAttribute("y", "1.5");

                        rect.setAttribute("width", width - 3);
                        rect.setAttribute("height", height - 3);

                        rect.setAttribute(
                            "rx",
                            Math.max(0, radius - 1.5)
                        );

                    });

                };

                const skillsBorderObserver =
                    new ResizeObserver(updateSkillsBorder);

                skillsBorderObserver.observe(card);

                requestAnimationFrame(updateSkillsBorder);

            });

            slider.appendChild(track);


            // Create navigation controls.

            const controls = document.createElement("div");

            controls.className = "desktop-skills-controls";


            // Previous button.

            const previous = document.createElement("button");

            previous.className = "desktop-skills-arrow";
            previous.type = "button";
            previous.innerHTML = "&#10094;";

            previous.setAttribute(
                "aria-label",
                "Previous skills"
            );


            // Pagination dots.

            const pagination = document.createElement("div");

            pagination.className = "desktop-skills-pagination";


            // Next button.

            const next = document.createElement("button");

            next.className = "desktop-skills-arrow";
            next.type = "button";
            next.innerHTML = "&#10095;";

            next.setAttribute(
                "aria-label",
                "Next skills"
            );


            controls.appendChild(previous);
            controls.appendChild(pagination);
            controls.appendChild(next);

            slider.appendChild(controls);


            // Slider functionality.

            let currentSlide = 0;

            const dots = [];

            cards.forEach((card, index) => {

                const dot = document.createElement("button");

                dot.className = "desktop-skills-dot";

                dot.type = "button";

                dot.setAttribute(
                    "aria-label",
                    `Go to skill category ${index + 1}`
                );

                dot.addEventListener("click", () => {

                    showSlide(index);

                });

                pagination.appendChild(dot);

                dots.push(dot);

            });


            function showSlide(index) {

                if (!cards.length) return;

                currentSlide =
                    (index + cards.length) % cards.length;

                track.style.transform =
                    `translateX(-${currentSlide * 100}%)`;

                dots.forEach((dot, dotIndex) => {

                    dot.classList.toggle(
                        "active",
                        dotIndex === currentSlide
                    );

                });

                previous.disabled = currentSlide === 0;

                next.disabled = currentSlide === cards.length - 1;

            }


            previous.addEventListener("click", () => {

                if (currentSlide > 0) {

                    showSlide(currentSlide - 1);

                }

            });


            next.addEventListener("click", () => {

                if (currentSlide < cards.length - 1) {

                    showSlide(currentSlide + 1);

                }

            });


            // Mouse drag and touch swipe support.

            let startX = 0;
            let isDragging = false;

            slider.addEventListener("pointerdown", event => {

                if (event.target.closest("button")) return;

                startX = event.clientX;

                isDragging = true;

            });

            slider.addEventListener("pointerup", event => {

                if (!isDragging) return;

                const difference = event.clientX - startX;

                if (Math.abs(difference) > 50) {

                    if (
                        difference < 0 &&
                        currentSlide < cards.length - 1
                    ) {

                        showSlide(currentSlide + 1);

                    }

                    if (
                        difference > 0 &&
                        currentSlide > 0
                    ) {

                        showSlide(currentSlide - 1);

                    }

                }

                isDragging = false;

            });

            slider.addEventListener("pointercancel", () => {

                isDragging = false;

            });


            // Start from the first category.

            showSlide(0);


            // Add slider to desktop Skills view.

            desktopSkillsView.appendChild(slider);

        }

        vscode.insertBefore(
            desktopSkillsView,
            status
        );

    }


    /* =====================================================
       CREATE DESKTOP QUALIFICATION VIEW
    ===================================================== */

/* =====================================================
   CREATE DESKTOP QUALIFICATION VIEW
   Education and Work Experience in two horizontal rows
===================================================== */

function createDesktopQualificationView() {

    if (desktopQualificationView) return;

    const sourceContainer = qualification.querySelector(
        ".qualification__container"
    );

    if (!sourceContainer) return;

    const educationSection = sourceContainer.querySelector("#education");

    if (!educationSection) return;

    desktopQualificationView = document.createElement("div");
    desktopQualificationView.className =
        "vscode-desktop-qualification-view";

    const layout = document.createElement("div");
    layout.className = "desktop-qualification-layout";

    /* EDUCATION ROW */

    const row = document.createElement("div");
    row.className =
        "desktop-qualification-row desktop-education-row";

    /* LEFT HEADING */

    const heading = document.createElement("div");
    heading.className = "desktop-qualification-heading";

    heading.innerHTML = `
        <div class="desktop-qualification-heading-icon">
            <i class="uil uil-graduation-cap"></i>
        </div>

        <div class="desktop-qualification-heading-text">
            <span class="desktop-qualification-eyebrow">
                MY JOURNEY
            </span>
            <h3>Education</h3>
        </div>

        <span class="desktop-qualification-heading-line"></span>
    `;

    /* RIGHT CARDS */

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "desktop-qualification-cards";

    const items = educationSection.querySelectorAll(
        ".qualification__data"
    );

    items.forEach((item, index) => {

        const titleElement = item.querySelector(
            ".qualification__title"
        );

        if (!titleElement) return;

        const card = document.createElement("article");
        card.className = "desktop-qualification-card";

        const number = document.createElement("span");
        number.className = "desktop-qualification-card-number";
        number.textContent = String(index + 1).padStart(2, "0");

        const cardContent = document.createElement("div");
        cardContent.className = "desktop-qualification-card-content";

        const title = titleElement.cloneNode(true);
        title.classList.add("desktop-qualification-card-title");
        cardContent.appendChild(title);

        const subtitleElement = item.querySelector(
            ".qualification__subtitle"
        );

        if (subtitleElement) {
            const subtitle = subtitleElement.cloneNode(true);
            subtitle.classList.add(
                "desktop-qualification-card-subtitle"
            );
            cardContent.appendChild(subtitle);
        }

        const calendarElement = item.querySelector(
            ".qualification__calendar"
        );

        if (calendarElement) {
            const calendar = calendarElement.cloneNode(true);
            calendar.classList.add(
                "desktop-qualification-card-date"
            );
            cardContent.appendChild(calendar);
        }

        const accent = document.createElement("span");
        accent.className = "desktop-qualification-card-accent";

        card.append(number, cardContent, accent);
        cardsContainer.appendChild(card);

    });

    row.append(heading, cardsContainer);
    layout.appendChild(row);

    desktopQualificationView.appendChild(layout);

    vscode.insertBefore(
        desktopQualificationView,
        status
    );
}


    /* =====================================================
       CREATE DESKTOP SERVICES VIEW
       Uses the existing Services content and keeps its popups working.
    ===================================================== */

    function createDesktopServicesView() {

        if (desktopServicesView) return;

        desktopServicesView = document.createElement("div");
        desktopServicesView.className = "vscode-desktop-services-view";

        const heading = document.createElement("div");
        heading.className = "desktop-services-heading";

        const sourceTitle = services.querySelector(".section__title");
        const sourceSubtitle = services.querySelector(".section__subtitle");



        if (sourceSubtitle) {
            const subtitle = sourceSubtitle.cloneNode(true);
            subtitle.classList.add("desktop-services-subtitle");
            heading.appendChild(subtitle);
        }

        desktopServicesView.appendChild(heading);

        const sourceContainer = services.querySelector(".services__container");

        if (sourceContainer) {

            const servicesContent = sourceContainer.cloneNode(true);
            servicesContent.classList.add("desktop-services-container");

            const serviceCards = Array.from(
                servicesContent.querySelectorAll(".services__content")
            );

            serviceCards.forEach((card, index) => {

                card.classList.add("desktop-service-card");

                const modal = card.querySelector(".services__modal");
                const button = card.querySelector(".services__button");

                if (button && modal) {
                    button.addEventListener("click", event => {
                        event.preventDefault();
                        event.stopPropagation();

                        servicesContent.querySelectorAll(".services__modal").forEach(item => {
                            item.classList.remove("active-modal");
                        });

                        modal.classList.add("active-modal");
                    });
                }

                if (modal) {
                    modal.classList.add("desktop-service-modal");

                    const closeButton = modal.querySelector(
                        ".services__modal-close"
                    );

                    closeButton?.addEventListener("click", event => {
                        event.preventDefault();
                        event.stopPropagation();
                        modal.classList.remove("active-modal");
                    });

                    modal.addEventListener("click", event => {
                        if (event.target === modal) {
                            modal.classList.remove("active-modal");
                        }
                    });
                    // Move popup outside the slider so cards cannot cover it.
document.body.appendChild(modal);
                }

            });

            // One-card-at-a-time service slider with a slim title tab strip.
            if (serviceCards.length) {
                const tabBar = document.createElement("div");
                tabBar.className = "desktop-services-tabs";
                tabBar.setAttribute("role", "tablist");
                tabBar.setAttribute("aria-label", "Services");

                const viewport = document.createElement("div");
                viewport.className = "desktop-services-slider-viewport";

                const track = document.createElement("div");
                track.className = "desktop-services-slider-track";

                const controls = document.createElement("div");
                controls.className = "desktop-services-slider-controls";

                const previous = document.createElement("button");
                previous.type = "button";
                previous.className = "desktop-services-arrow";
                previous.setAttribute("aria-label", "Previous service");
                previous.innerHTML = '<i class="uil uil-angle-left-b"></i>';

                const counter = document.createElement("span");
                counter.className = "desktop-services-counter";
                counter.setAttribute("aria-live", "polite");

                const next = document.createElement("button");
                next.type = "button";
                next.className = "desktop-services-arrow";
                next.setAttribute("aria-label", "Next service");
                next.innerHTML = '<i class="uil uil-angle-right-b"></i>';

                let activeService = 0;
                const tabs = serviceCards.map((card, index) => {
                    const title = card.querySelector(".services__title");
                    const label = title ? title.textContent.replace(/\s+/g, " ").trim() : `Service ${index + 1}`;
                    const tab = document.createElement("button");
                    tab.type = "button";
                    tab.className = "desktop-services-tab";
                    tab.textContent = label;
                    tab.setAttribute("role", "tab");
                    tab.addEventListener("click", () => showService(index));
                    tabBar.appendChild(tab);
                    track.appendChild(card);
                    return tab;
                });

                function showService(index) {
                    activeService = (index + serviceCards.length) % serviceCards.length;
                    track.style.transform = `translateX(-${activeService * 100}%)`;
                    tabs.forEach((tab, tabIndex) => {
                        const selected = tabIndex === activeService;
                        tab.classList.toggle("active", selected);
                        tab.setAttribute("aria-selected", String(selected));
                        tab.tabIndex = selected ? 0 : -1;
                    });
                    counter.textContent = `${String(activeService + 1).padStart(2, "0")} / ${String(serviceCards.length).padStart(2, "0")}`;
                    previous.disabled = serviceCards.length < 2;
                    next.disabled = serviceCards.length < 2;
                }

                previous.addEventListener("click", () => showService(activeService - 1));
                next.addEventListener("click", () => showService(activeService + 1));
                viewport.appendChild(track);
                controls.append(previous, counter, next);
                servicesContent.append(tabBar, viewport, controls);
                showService(0);
            }

            desktopServicesView.appendChild(servicesContent);

        }

        vscode.insertBefore(desktopServicesView, status);

    }


    /* =====================================================
       CREATE DESKTOP PORTFOLIO VIEW
       Professional responsive project showcase
    ===================================================== */

    function createDesktopPortfolioView() {

        if (desktopPortfolioView) return;

        desktopPortfolioView = document.createElement("div");
        desktopPortfolioView.className = "vscode-desktop-portfolio-view";

        /* Portfolio heading */

        const heading = document.createElement("div");
        heading.className = "desktop-portfolio-heading";

        heading.innerHTML = `
            <span class="desktop-portfolio-eyebrow">
                MY WORK & ACHIEVEMENTS
            </span>

            <h2>Portfolio</h2>

            <p>
                A collection of my projects, research and development work.
            </p>
        `;

        desktopPortfolioView.appendChild(heading);

        /* Project grid */

        const grid = document.createElement("div");
        grid.className = "desktop-portfolio-grid";

        const sourceContainer = portfolio.querySelector(
            ".portfolio__container"
        );

        if (sourceContainer) {

            const slides = Array.from(
                sourceContainer.querySelectorAll(".portfolio__content")
            ).filter(slide =>
                !slide.classList.contains("swiper-slide-duplicate")
            );

            slides.forEach((slide, index) => {

                const card = document.createElement("article");
                card.className = "desktop-portfolio-card";

                /* Project image */

                const sourceImage = slide.querySelector(".portfolio__img");

                if (sourceImage) {

                    const imageWrapper = document.createElement("div");
                    imageWrapper.className = "desktop-portfolio-image";

                    const image = sourceImage.cloneNode(true);
                    image.removeAttribute("style");
                    image.removeAttribute("target");

                    imageWrapper.appendChild(image);
                    card.appendChild(imageWrapper);

                }

                /* Project information */

                const data = document.createElement("div");
                data.className = "desktop-portfolio-data";

                const number = document.createElement("span");
                number.className = "desktop-portfolio-number";
                number.textContent = `PROJECT ${String(index + 1).padStart(2, "0")}`;
                data.appendChild(number);

                const sourceTitle = slide.querySelector(".portfolio__title");

                if (sourceTitle) {

                    const title = sourceTitle.cloneNode(true);
                    title.className = "desktop-portfolio-title";
                    data.appendChild(title);

                }

                const sourceDescription = slide.querySelector(
                    ".portfolio__description"
                );

                if (sourceDescription) {

                    const description = sourceDescription.cloneNode(true);
                    description.className = "desktop-portfolio-description";
                    data.appendChild(description);

                }

                /* Project link */

                const sourceButton = slide.querySelector(".portfolio__button");

                if (sourceButton) {

                    const button = sourceButton.cloneNode(true);
                    button.className = "desktop-portfolio-button";
                    button.innerHTML = `
                        View Project
                        <i class="uil uil-arrow-up-right"></i>
                    `;
                    button.target = "_blank";
                    button.rel = "noopener noreferrer";

                    data.appendChild(button);

                }

                card.appendChild(data);
                grid.appendChild(card);

            });

        }

        /* Show two projects per page, with controls for the next pair. */
        const cards = Array.from(grid.children);
        const viewport = document.createElement("div");
        viewport.className = "desktop-portfolio-slider-viewport";

        const track = document.createElement("div");
        track.className = "desktop-portfolio-slider-track";

        for (let i = 0; i < cards.length; i += 2) {
            const page = document.createElement("div");
            page.className = "desktop-portfolio-page";
            cards.slice(i, i + 2).forEach(card => page.appendChild(card));
            track.appendChild(page);
        }

        viewport.appendChild(track);
        desktopPortfolioView.appendChild(viewport);

        const controls = document.createElement("div");
        controls.className = "desktop-portfolio-slider-controls";
        controls.innerHTML = `
            <span class="desktop-portfolio-counter" aria-live="polite">01 / ${String(Math.max(1, Math.ceil(cards.length / 2))).padStart(2, "0")}</span>
            <button class="desktop-portfolio-arrow desktop-portfolio-prev" type="button" aria-label="Previous projects">‹</button>
            <button class="desktop-portfolio-arrow desktop-portfolio-next" type="button" aria-label="Next projects">›</button>
        `;
        desktopPortfolioView.appendChild(controls);

        const pages = Array.from(track.children);
        let currentPage = 0;
        const counter = controls.querySelector(".desktop-portfolio-counter");
        const previous = controls.querySelector(".desktop-portfolio-prev");
        const next = controls.querySelector(".desktop-portfolio-next");

        const updateSlider = () => {
            track.style.transform = `translateX(-${currentPage * 100}%)`;
            counter.textContent = `${String(currentPage + 1).padStart(2, "0")} / ${String(Math.max(1, pages.length)).padStart(2, "0")}`;
            previous.disabled = currentPage === 0;
            next.disabled = currentPage >= pages.length - 1;
        };

        previous.addEventListener("click", () => {
            if (currentPage > 0) { currentPage--; updateSlider(); }
        });
        next.addEventListener("click", () => {
            if (currentPage < pages.length - 1) { currentPage++; updateSlider(); }
        });
        updateSlider();

        vscode.insertBefore(desktopPortfolioView, status);

    }


    /* =====================================================
       CREATE DESKTOP CONTACT VIEW
       Beautiful contact panel with real email submission.
    ===================================================== */

    function createDesktopContactView() {

        if (desktopContactView) return;

        desktopContactView = document.createElement("div");
        desktopContactView.className = "vscode-desktop-contact-view";

        const heading = document.createElement("div");
        heading.className = "desktop-contact-heading";
        heading.innerHTML = `
            <span class="desktop-contact-eyebrow">07 / LET'S CONNECT</span>
  
            <p>Have an idea, a project, or an opportunity? I would love to hear from you.</p>
        `;
        desktopContactView.appendChild(heading);

        const sourceContainer = contact.querySelector(".contact__container");

        if (sourceContainer) {

            const contactCopy = sourceContainer.cloneNode(true);
            contactCopy.classList.add("desktop-contact-container");

            const details = contactCopy.firstElementChild;
            if (details) {
                details.classList.add("desktop-contact-details");
            }

            // Use the requested receiving address in the contact details.
            contactCopy.querySelectorAll(".contact__information").forEach(info => {
                const title = info.querySelector(".contact__title")?.textContent.trim().toLowerCase();
                const subtitle = info.querySelector(".contact__subtitle");
                if (!subtitle) return;

                const value = subtitle.textContent.trim();

                if (title === "email") {
                    subtitle.textContent = "mohiy.social@gmail.com";
                    const link = document.createElement("a");
                    link.href = "mailto:mohiy.social@gmail.com";
                    link.textContent = "mohiy.social@gmail.com";
                    link.className = "desktop-contact-link";
                    subtitle.replaceWith(link);
                } else if (title === "call me") {
                    const link = document.createElement("a");
                    link.href = `tel:${value.replace(/[^+\d]/g, "")}`;
                    link.textContent = value;
                    link.className = "desktop-contact-link";
                    subtitle.replaceWith(link);
                }
            });

            const form = contactCopy.querySelector(".contact__form");

            if (form) {
                form.classList.add("desktop-contact-form");
                form.id = "desktopContactForm";
                form.action = "https://formsubmit.co/ajax/mohiy.social@gmail.com";
                form.method = "POST";

                const fields = Array.from(form.querySelectorAll(".contact__content"));
                const fieldNames = ["name", "email", "project", "message"];

                fields.forEach((field, index) => {
                    const input = field.querySelector("input, textarea");
                    const label = field.querySelector("label");
                    if (!input) return;

                    const fieldId = `desktop-contact-${fieldNames[index] || index}`;
                    input.id = fieldId;
                    input.name = fieldNames[index] || `field_${index}`;
                    input.placeholder = label?.textContent.trim() || "";
                    input.autocomplete = index === 0 ? "name" : index === 1 ? "email" : "off";
                    input.required = index !== 2;
                    if (label) label.htmlFor = fieldId;

                    if (input.tagName === "TEXTAREA") {
                        input.rows = 4;
                        input.maxLength = 4000;
                        input.required = true;
                        input.placeholder = "Tell me a little about your idea or project...";
                    } else {
                        input.maxLength = index === 0 ? 100 : 160;
                    }
                });

                const submitLink = form.querySelector("a.button");
                if (submitLink) {
                    const button = document.createElement("button");
                    button.type = "submit";
                    button.className = "button button--flex desktop-contact-submit";
                    button.innerHTML = 'Send Message <i class="uil uil-message button__icon"></i>';
                    submitLink.replaceWith(button);
                }

                const subject = document.createElement("input");
                subject.type = "hidden";
                subject.name = "_subject";
                subject.value = "New portfolio enquiry";

                const template = document.createElement("input");
                template.type = "hidden";
                template.name = "_template";
                template.value = "table";

                const honeypot = document.createElement("input");
                honeypot.type = "text";
                honeypot.name = "_honey";
                honeypot.className = "desktop-contact-honeypot";
                honeypot.tabIndex = -1;
                honeypot.autocomplete = "off";
                honeypot.setAttribute("aria-hidden", "true");

                form.append(subject, template, honeypot);

                const statusMessage = document.createElement("p");
                statusMessage.className = "desktop-contact-status";
                statusMessage.id = "desktopContactStatus";
                statusMessage.setAttribute("role", "status");
                statusMessage.setAttribute("aria-live", "polite");
                statusMessage.textContent = "Your message will be sent directly to my inbox.";
                form.appendChild(statusMessage);

                form.addEventListener("submit", async event => {
                    event.preventDefault();

                    if (!form.reportValidity()) return;

                    const submitButton = form.querySelector(".desktop-contact-submit");
                    const status = form.querySelector(".desktop-contact-status");
                    const originalButtonText = submitButton.innerHTML;

                    submitButton.disabled = true;
                    submitButton.innerHTML = '<i class="uil uil-spinner-alt"></i> Sending...';
                    status.className = "desktop-contact-status is-sending";
                    status.textContent = "Sending your message securely...";

                    try {
                        const payload = Object.fromEntries(new FormData(form).entries());
                        const response = await fetch(form.action, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            },
                            body: JSON.stringify(payload)
                        });

                        let result = {};
                        try { result = await response.json(); } catch (_) {}

                        if (!response.ok || result.success === false || result.success === "false") {
                            throw new Error(result.message || result.error || "The message could not be sent. Please try again.");
                        }

                        form.reset();
                        status.className = "desktop-contact-status is-success";
                        status.textContent = "Message submitted! If this is your first submission, please confirm the FormSubmit activation email sent to mohiy.social@gmail.com. After activation, new messages will arrive directly in your inbox.";

                    } catch (error) {
                        status.className = "desktop-contact-status is-error";
                        status.textContent = error.message || "Something went wrong. Please try again, or email mohiy.social@gmail.com directly.";
                    } finally {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                    }
                });
            }

            desktopContactView.appendChild(contactCopy);
        }

        vscode.insertBefore(desktopContactView, status);

        
    }


    /* =====================================================
       CHANGE DESKTOP VIEW
    ===================================================== */

    function setDesktopView(nextIndex) {

        if (!desktop.matches || mobile.matches) return;

        // Keep index between 0 and 6 (including Contact Me).

        nextIndex = Math.max(0, Math.min(6, nextIndex));

        if (nextIndex === desktopViewIndex) return;

        setupDesktopProfileHeading();


        // Create views only when needed.

        if (nextIndex >= 1) {

            createDesktopAboutView();

        }

        if (nextIndex >= 2) {

            createDesktopSkillsView();

        }

        if (nextIndex >= 3) {

            createDesktopQualificationView();

        }

        if (nextIndex >= 4) {

            createDesktopServicesView();

        }

        if (nextIndex >= 5) {

            createDesktopPortfolioView();

        }

        if (nextIndex >= 6) {

            createDesktopContactView();

        }


        /* INTRODUCTION */

        profile.classList.toggle(
            "vscode-desktop-hidden",
            nextIndex !== 0
        );


        /* ABOUT ME */

        if (desktopAboutView) {

            desktopAboutView.style.display =
                nextIndex === 1 ? "block" : "none";

        }


        /* SKILLS */

        if (desktopSkillsView) {

            desktopSkillsView.style.display =
                nextIndex === 2 ? "grid" : "none";

        }


        /* QUALIFICATION */

        if (desktopQualificationView) {

            desktopQualificationView.style.display =
                nextIndex === 3 ? "block" : "none";

        }


        /* SERVICES */

        if (desktopServicesView) {

            desktopServicesView.style.display =
                nextIndex === 4 ? "block" : "none";

        }

        /* PORTFOLIO */

        if (desktopPortfolioView) {

            desktopPortfolioView.style.display =
                nextIndex === 5 ? "block" : "none";

        }

        /* CONTACT ME */

        if (desktopContactView) {

            desktopContactView.style.display =
                nextIndex === 6 ? "block" : "none";

        }


        /* UPDATE TITLE BAR */

        const desktopTitles = [
            "Introduction",
            "About Me",
            "Skills",
            "Qualification",
            "Services",
            "Portfolio",
            "Contact Me"
        ];

        const desktopIcons = [
            "uil-estate",
            "uil-user",
            "uil-brackets-curly",
            "uil-graduation-cap",
            "uil-briefcase-alt",
            "uil-folder",
            "uil-envelope-alt"
        ];

        if (titleLabel) {

            titleLabel.textContent =
                desktopTitles[nextIndex];

        }

        if (titleIcon) {

            titleIcon.className =
                `vscode-mini-title-icon uil ${desktopIcons[nextIndex]}`;

        }

        desktopViewIndex = nextIndex;

    }


    /* =====================================================
       INITIAL DESKTOP HEADING
    ===================================================== */

    if (desktop.matches) {

        setupDesktopProfileHeading();

    }


    /* =====================================================
       DESKTOP / TABLET BREAKPOINT CHANGE
    ===================================================== */

    desktop.addEventListener("change", () => {

        if (desktop.matches) {

            setupDesktopProfileHeading();

        } else {

            restoreDesktopProfileHeading();

            desktopAboutView?.remove();
            desktopSkillsView?.remove();
            desktopQualificationView?.remove();
            desktopServicesView?.remove();
            desktopPortfolioView?.remove();
            desktopContactView?.remove();

            desktopAboutView = null;
            desktopSkillsView = null;
            desktopQualificationView = null;
            desktopServicesView = null;
            desktopPortfolioView = null;
            desktopContactView = null;

            desktopViewIndex = 0;

            profile.classList.remove(
                "vscode-desktop-hidden"
            );

            if (titleLabel) {

                titleLabel.textContent = "Introduction";

            }

            if (titleIcon) {

                titleIcon.className =
                    "vscode-mini-title-icon uil uil-estate";

            }

        }

    });


    /* =====================================================
       MOUSE WHEEL NAVIGATION
    ===================================================== */

    vscode.addEventListener("wheel", event => {

        if (
            !desktop.matches ||
            mobile.matches ||
            Math.abs(event.deltaY) < 8
        ) return;

        event.preventDefault();

        if (desktopWheelLocked) return;

        const direction = event.deltaY > 0 ? 1 : -1;

        const nextIndex =
            desktopViewIndex + direction;

        if (nextIndex >= 0 && nextIndex <= 6) {

            setDesktopView(nextIndex);

            desktopWheelLocked = true;

            window.setTimeout(() => {

                desktopWheelLocked = false;

            }, 650);

        }

    }, { passive: false });


    /* =====================================================
       KEYBOARD NAVIGATION
    ===================================================== */

    window.addEventListener("keydown", event => {

        if (
            !desktop.matches ||
            mobile.matches ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey
        ) return;

        // Do not intercept keys while typing in a form field.

        if (
            event.target.matches("input, textarea, select") ||
            event.target.isContentEditable
        ) return;


        if (
            event.key === "PageDown" ||
            event.key === "ArrowDown"
        ) {

            event.preventDefault();

            setDesktopView(desktopViewIndex + 1);

        }

        else if (
            event.key === "PageUp" ||
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            setDesktopView(desktopViewIndex - 1);

        }

    });


    /* =====================================================
       INITIAL SETUP
    ===================================================== */
    /* =========================================
   BUBBLE SWITCH RESPONSIVE POSITIONING
========================================= */

const bubbleSwitch = document.getElementById("bubble-toggle");
const profileImageBox = home.querySelector(".home__img");
const statusStrip = vscode.querySelector(".vscode-mini-status");

const desktopBubbleLayout = window.matchMedia("(min-width: 1025px)");

function positionBubbleSwitch() {

   if (desktopBubbleLayout.matches) {

    // Put the switch directly below the profile image
    profileImageBox.appendChild(bubbleSwitch);

    profileImageBox.style.position = "relative";
    profileImageBox.style.overflow = "visible";
    

    bubbleSwitch.style.setProperty("position", "absolute", "important");
    bubbleSwitch.style.setProperty("left", "50%", "important");
    bubbleSwitch.style.setProperty("top", "calc(100% + 10px)", "important");
    bubbleSwitch.style.setProperty("right", "auto", "important");
    bubbleSwitch.style.setProperty("bottom", "auto", "important");
    bubbleSwitch.style.setProperty("transform", "translateX(-50%)", "important");
    bubbleSwitch.style.setProperty("margin", "0", "important");

} else {

        // Tablet/mobile: keep the existing position in the blue strip
        statusStrip.appendChild(bubbleSwitch);

        bubbleSwitch.style.position = "absolute";
        bubbleSwitch.style.left = "50%";
        bubbleSwitch.style.top = "50%";
        bubbleSwitch.style.right = "auto";
        bubbleSwitch.style.bottom = "auto";
        bubbleSwitch.style.transform = "translate(-50%, -50%)";
        bubbleSwitch.style.margin = "0";
    }
}

positionBubbleSwitch();

desktopBubbleLayout.addEventListener("change", positionBubbleSwitch);

    modeChange();

});


/* =========================================================
   ABOUT ME SWIPER
========================================================= */

var mySwiper_about_me = new Swiper('.swiper-container-about-me', {

    loop: true,

    effect: 'cube',

    cubeEffect: {
        slideShadows: false,
        shadow: false,
    },

    autoplay: {
        delay: 3500,
    },

});


/* =========================================================
   MOBILE INTRO: ROLE TYPING ANIMATION
   Desktop remains unchanged.
========================================================= */

(() => {


    const roleElement = document.querySelector(
        "#home .profile-card-heading h3"
    )?.parentElement?.querySelector("span");

    if (!roleElement) return;

    const roles = [
        "Full Stack Developer",
        "AI Developer",
        "ML Developer",
        "DB Expert"
    ];

    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;

    roleElement.textContent = roles[0];


    function animateRole() {

        const currentRole = roles[roleIndex];

        if (deleting) {

            characterIndex--;

            roleElement.textContent =
                currentRole.substring(0, characterIndex);

            if (characterIndex === 0) {

                deleting = false;

                roleIndex = (roleIndex + 1) % roles.length;

                setTimeout(animateRole, 400);

                return;

            }

            setTimeout(animateRole, 55);

        } else {

            const nextRole = roles[roleIndex];

            characterIndex++;

            roleElement.textContent =
                nextRole.substring(0, characterIndex);

            if (characterIndex === nextRole.length) {

                deleting = true;

                setTimeout(animateRole, 1800);

                return;

            }

            setTimeout(animateRole, 85);

        }

    }


    setTimeout(animateRole, 1800);

})();

