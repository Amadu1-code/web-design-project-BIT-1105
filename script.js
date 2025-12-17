// script.js - Complete Football Agency Website JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Player Filtering
    const playerSearch = document.getElementById('playerSearch');
    const positionFilter = document.getElementById('positionFilter');
    const ageFilter = document.getElementById('ageFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    function filterPlayers() {
        const searchValue = playerSearch ? playerSearch.value.toLowerCase() : '';
        const positionValue = positionFilter ? positionFilter.value : '';
        const ageValue = ageFilter ? ageFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';
        
        const playerProfiles = document.querySelectorAll('.player-profile');
        
        let visibleCount = 0;
        
        playerProfiles.forEach(profile => {
            const playerName = profile.querySelector('h3').textContent.toLowerCase();
            const playerPosition = profile.getAttribute('data-position');
            const playerAge = profile.getAttribute('data-age');
            const playerStatus = profile.getAttribute('data-status');
            
            const matchesSearch = searchValue === '' || playerName.includes(searchValue);
            const matchesPosition = positionValue === '' || playerPosition === positionValue;
            const matchesAge = ageValue === '' || checkAgeRange(playerAge, ageValue);
            const matchesStatus = statusValue === '' || playerStatus === statusValue;
            
            if (matchesSearch && matchesPosition && matchesAge && matchesStatus) {
                profile.style.display = 'block';
                visibleCount++;
            } else {
                profile.style.display = 'none';
            }
        });
        
        // Show message if no players match filters
        const noResultsMessage = document.getElementById('noResultsMessage');
        if (!noResultsMessage && visibleCount === 0 && playerProfiles.length > 0) {
            const playersGrid = document.querySelector('.players-grid');
            const message = document.createElement('div');
            message.id = 'noResultsMessage';
            message.className = 'no-results card-3d';
            message.innerHTML = `
                <h3>No Players Found</h3>
                <p>Try adjusting your search filters</p>
                <button id="resetFilters" class="btn-3d btn-small">Reset All Filters</button>
            `;
            playersGrid.parentNode.insertBefore(message, playersGrid.nextSibling);
            
            document.getElementById('resetFilters').addEventListener('click', resetFilters);
        } else if (noResultsMessage && visibleCount > 0) {
            noResultsMessage.remove();
        }
    }
    
    function checkAgeRange(age, range) {
        const ageNum = parseInt(age);
        switch(range) {
            case 'u20': return ageNum < 20;
            case '20-25': return ageNum >= 20 && ageNum <= 25;
            case '25-30': return ageNum > 25 && ageNum <= 30;
            case '30+': return ageNum > 30;
            default: return true;
        }
    }
    
    function resetFilters() {
        if (playerSearch) playerSearch.value = '';
        if (positionFilter) positionFilter.value = '';
        if (ageFilter) ageFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        filterPlayers();
    }
    
    // Add event listeners for filtering
    if (playerSearch) playerSearch.addEventListener('input', filterPlayers);
    if (positionFilter) positionFilter.addEventListener('change', filterPlayers);
    if (ageFilter) ageFilter.addEventListener('change', filterPlayers);
    if (statusFilter) statusFilter.addEventListener('change', filterPlayers);
    
    // 3D Card Hover Effects
    const cards = document.querySelectorAll('.card-3d');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Disable on mobile
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
            }, 500);
        });
    });
    
    // Matches Tabs
    const matchTabs = document.querySelectorAll('.match-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    matchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            matchTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Live Score Simulation
    function simulateLiveMatch() {
        const team1Score = document.getElementById('team1-score');
        const team2Score = document.getElementById('team2-score');
        const matchTime = document.querySelector('.match-time');
        
        if (team1Score && team2Score && matchTime) {
            // Only simulate if on matches page and live match exists
            if (!document.querySelector('.live-match-banner')) return;
            
            // Simulate minute increase
            let minutes = parseInt(matchTime.textContent.replace("'", ""));
            if (minutes < 90) {
                minutes += 1;
                matchTime.textContent = minutes + "'";
                
                // Randomly update scores
                if (minutes === 70 && Math.random() > 0.7) {
                    team1Score.textContent = parseInt(team1Score.textContent) + 1;
                    addMatchEvent("70'", "Goal! S. Bangura (FSL)");
                    showGoalNotification("Goal! Samuel Bangura scores for Freetown SL!");
                }
                
                if (minutes === 80 && Math.random() > 0.8) {
                    team2Score.textContent = parseInt(team2Score.textContent) + 1;
                    addMatchEvent("80'", "Goal! A. Koroma (BR)");
                    showGoalNotification("Goal! Abubakarr Koroma scores for Bo Rangers!");
                }
                
                // Update match status
                if (minutes === 45) {
                    document.querySelector('.match-status').textContent = "Half Time";
                } else if (minutes === 46) {
                    document.querySelector('.match-status').textContent = "Second Half";
                } else if (minutes >= 90) {
                    matchTime.textContent = "FT";
                    document.querySelector('.match-status').textContent = "Full Time";
                    clearInterval(liveMatchInterval);
                }
            } else if (minutes === 90) {
                matchTime.textContent = "FT";
                document.querySelector('.match-status').textContent = "Full Time";
                clearInterval(liveMatchInterval);
            }
        }
    }
    
    function addMatchEvent(time, text) {
        const eventsContainer = document.querySelector('.match-events');
        if (eventsContainer) {
            const eventElement = document.createElement('div');
            eventElement.className = 'event';
            eventElement.innerHTML = `
                <span class="event-time">${time}</span>
                <span class="event-text">${text}</span>
            `;
            eventsContainer.appendChild(eventElement);
        }
    }
    
    function showGoalNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'goal-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-futbol"></i>
                <span>${message}</span>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .goal-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(145deg, var(--primary), var(--primary-dark));
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: slideIn 0.5s ease;
                max-width: 350px;
                border-left: 5px solid var(--accent);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .notification-content i.fa-futbol {
                color: var(--accent);
                font-size: 1.5rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);
    }
    
    // Start live match simulation if on matches page with live match
    let liveMatchInterval;
    if (document.querySelector('.live-match-banner')) {
        liveMatchInterval = setInterval(simulateLiveMatch, 5000);
    }
    
    // Player Profile Modal
    const viewProfileBtns = document.querySelectorAll('.view-profile');
    viewProfileBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const playerCard = this.closest('.player-profile');
            const playerName = playerCard.querySelector('h3').textContent;
            const playerPosition = playerCard.querySelector('.tag.position').textContent;
            const playerAge = playerCard.querySelector('.detail-row:nth-child(1) .detail-value').textContent;
            const playerImg = playerCard.querySelector('.player-img img').src;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'player-modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content card-3d">
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                    <div class="modal-header">
                        <div class="modal-img">
                            <img src="${playerImg}" alt="${playerName}">
                        </div>
                        <div class="modal-info">
                            <h2>${playerName}</h2>
                            <p class="modal-position">${playerPosition} | Age: ${playerAge}</p>
                            <div class="modal-stats">
                                ${playerCard.querySelector('.player-stats').innerHTML}
                            </div>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="modal-section">
                            <h3>Player Details</h3>
                            ${playerCard.querySelector('.player-details').innerHTML}
                        </div>
                        <div class="modal-section">
                            <h3>Club History</h3>
                            ${playerCard.querySelector('.club-history').innerHTML}
                        </div>
                        <div class="modal-actions">
                            <a href="contact.html?player=${encodeURIComponent(playerName)}" class="btn-3d btn-primary">Contact Agent</a>
                            <button class="btn-3d btn-secondary close-modal">Close</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add styles
            const modalStyle = document.createElement('style');
            modalStyle.textContent = `
                .player-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    position: relative;
                    z-index: 2;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 40px;
                    background: var(--dark);
                    width: 100%;
                }
                .modal-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    color: var(--light);
                    font-size: 1.5rem;
                    cursor: pointer;
                    z-index: 3;
                }
                .modal-header {
                    display: flex;
                    gap: 30px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }
                .modal-img {
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 5px solid var(--accent);
                    flex-shrink: 0;
                }
                .modal-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .modal-info {
                    flex-grow: 1;
                }
                .modal-info h2 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    color: var(--light);
                }
                .modal-position {
                    color: var(--secondary);
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 20px;
                }
                .modal-section {
                    margin-bottom: 30px;
                }
                .modal-section h3 {
                    font-size: 1.5rem;
                    margin-bottom: 20px;
                    color: var(--accent);
                    border-bottom: 2px solid var(--primary);
                    padding-bottom: 10px;
                }
                .modal-actions {
                    display: flex;
                    gap: 20px;
                    margin-top: 40px;
                }
                @media (max-width: 768px) {
                    .modal-header {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                    .modal-actions {
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(modalStyle);
            
            // Add to page
            document.body.appendChild(modal);
            
            // Close modal
            const closeModal = () => {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    modal.remove();
                    modalStyle.remove();
                }, 300);
            };
            
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.querySelector('.close-modal').addEventListener('click', closeModal);
            modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
            
            // Prevent scrolling on body
            document.body.style.overflow = 'hidden';
            
            // Re-enable scrolling when modal closes
            modal.addEventListener('animationend', function() {
                if (this.style.animationName === 'fadeOut') {
                    document.body.style.overflow = '';
                }
            });
        });
    });
    
    // FAQ Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');
        });
    });
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                showAlert('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!validateEmail(data.email)) {
                showAlert('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showAlert('Message sent successfully! We will contact you soon.', 'success');
            this.reset();
        });
    }
    
    // Player Registration Form
    const playerRegistrationForm = document.getElementById('playerRegistrationForm');
    if (playerRegistrationForm) {
        playerRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'var(--danger)';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                showAlert('Please fill in all required fields.', 'error');
                return;
            }
            
            // Simulate form submission
            showAlert('Registration submitted successfully! We will review your application and contact you within 5-7 business days.', 'success');
            this.reset();
        });
    }
    
    // Alert function
    function showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="alert-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Add styles
        const alertStyle = document.createElement('style');
        alertStyle.textContent = `
            .alert {
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? 'linear-gradient(145deg, var(--success), #1e7e34)' : 
                          type === 'error' ? 'linear-gradient(145deg, var(--danger), #bd2130)' : 
                          'linear-gradient(145deg, var(--primary), var(--primary-dark))'};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: slideIn 0.5s ease;
                max-width: 400px;
                border-left: 5px solid ${type === 'success' ? 'var(--success)' : 
                                     type === 'error' ? 'var(--danger)' : 'var(--accent)'};
            }
            .alert-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .alert-content i:first-child {
                font-size: 1.5rem;
            }
            .alert-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(alertStyle);
        
        // Add to page
        document.body.appendChild(alert);
        
        // Close button
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                alert.remove();
                alertStyle.remove();
            }, 500);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideOut 0.5s ease';
                setTimeout(() => {
                    alert.remove();
                    alertStyle.remove();
                }, 500);
            }
        }, 5000);
    }
    
    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Newsletter Form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        const button = form.querySelector('button');
        const input = form.querySelector('input[type="email"]');
        
        if (button && input) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (input.value && validateEmail(input.value)) {
                    showAlert('Thank you for subscribing to our newsletter!', 'success');
                    input.value = '';
                } else {
                    showAlert('Please enter a valid email address.', 'error');
                }
            });
        }
    });
    
    // Calendar Navigation
    const calendarNavs = document.querySelectorAll('.calendar-nav');
    calendarNavs.forEach(nav => {
        nav.addEventListener('click', function() {
            const calendarMonth = document.querySelector('.calendar-month');
            const direction = this.querySelector('i').classList.contains('fa-chevron-left') ? -1 : 1;
            
            // Simple month navigation simulation
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
            
            const currentText = calendarMonth.textContent;
            const currentMonth = months.findIndex(m => currentText.includes(m));
            const currentYear = parseInt(currentText.split(' ')[1]);
            
            let newMonth = currentMonth + direction;
            let newYear = currentYear;
            
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            } else if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }
            
            calendarMonth.textContent = `${months[newMonth]} ${newYear}`;
            
            // Update calendar dates (simplified)
            updateCalendarDates(newMonth, newYear);
        });
    });
    
    function updateCalendarDates(month, year) {
        // In a real app, this would generate the correct calendar
        console.log(`Updating calendar for ${month}/${year}`);
    }
    
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a');
    navLinksAll.forEach(link => {
        const linkHref = link.getAttribute('href');
        if ((currentPage === 'index.html' && linkHref === 'index.html') || 
            (currentPage !== 'index.html' && linkHref === currentPage)) {
            link.classList.add('active');
        }
    });
    
    // Add active class to footer links
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if ((currentPage === 'index.html' && linkHref === 'index.html') || 
            (currentPage !== 'index.html' && linkHref === currentPage)) {
            link.classList.add('active');
        }
    });
    
    // Preload images for better performance
    function preloadImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                const image = new Image();
                image.src = src;
                image.onload = () => {
                    img.src = src;
                    img.removeAttribute('data-src');
                };
            }
        });
    }
    
    // Initialize image preloading
    preloadImages();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            // Check if it's a link to another page
            if (href.includes('.html')) return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll-to-top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(145deg, var(--primary), var(--primary-dark));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 999;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    // Add loading animation
    function showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-futbol fa-spin"></i>
            </div>
        `;
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;
        document.body.appendChild(loading);
        
        return loading;
    }
    
    // Simulate loading for certain actions
    const loadingTriggers = document.querySelectorAll('[data-loading]');
    loadingTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const loading = showLoading();
            setTimeout(() => {
                loading.remove();
            }, 1000);
        });
    });
    
    // Initialize any player search from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchPlayer = urlParams.get('search');
    if (searchPlayer && playerSearch) {
        playerSearch.value = searchPlayer;
        filterPlayers();
    }
});

// Add global error handling
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
});

// Add beforeunload event for form warning
window.addEventListener('beforeunload', function(e) {
    const forms = document.querySelectorAll('form');
    let hasUnsavedChanges = false;
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.value && !input.disabled) {
                hasUnsavedChanges = true;
            }
        });
    });
    
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Export functions for use in console (for debugging)
window.FootballAgency = {
    filterPlayers: () => {
        const filterFunction = document.querySelector('script').innerText.match(/function filterPlayers\(\)[\s\S]*?}/)[0];
        eval(filterFunction);
        filterPlayers();
    },
    simulateMatch: simulateLiveMatch,
    showAlert: showAlert
};