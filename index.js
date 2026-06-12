document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Global State & Navigation
    // -------------------------------------------------------------
    const slides = Array.from(document.querySelectorAll('.slide'));
    const totalSlides = slides.length;
    let currentSlideIndex = 0;

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const slideNumber = document.getElementById('slide-number');
    const slideProgress = document.getElementById('slide-progress');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const tocList = document.getElementById('toc-list');
    const modePresentation = document.getElementById('mode-presentation');
    const modeCaseStudy = document.getElementById('mode-case-study');
    const slidesViewport = document.getElementById('slides-viewport');
    const caseStudyViewport = document.getElementById('case-study-viewport');
    const shortcutsToast = document.getElementById('shortcuts-toast');
    const closeToastBtn = document.getElementById('close-toast-btn');

    // Populate TOC Sidebar
    slides.forEach((slide, idx) => {
        const title = slide.getAttribute('data-title') || `Slide ${idx + 1}`;
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" data-index="${idx}">${idx + 1}. ${title}</a>`;
        tocList.appendChild(li);
    });

    const tocItems = Array.from(tocList.querySelectorAll('li'));

    // Navigation function
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;

        // Slide animation directions
        slides.forEach((slide, idx) => {
            slide.classList.remove('active', 'prev-slide');
            if (idx === index) {
                slide.classList.add('active');
            } else if (idx < index) {
                slide.classList.add('prev-slide');
            }
        });

        currentSlideIndex = index;
        updateNavControls();
        triggerSlideWidgets(index);
    }

    function updateNavControls() {
        // Toggle disable buttons
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === totalSlides - 1;

        // Update indicators
        slideNumber.textContent = `${String(currentSlideIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
        
        // Progress bar
        const progressPercentage = ((currentSlideIndex + 1) / totalSlides) * 100;
        slideProgress.style.width = `${progressPercentage}%`;

        // Update active class in TOC
        tocItems.forEach((item, idx) => {
            if (idx === currentSlideIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Nav Event Listeners
    prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only trigger slide navigation if we are not typing in a text field
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        if (e.key === 'ArrowRight' || e.key === 'Space') {
            e.preventDefault();
            goToSlide(currentSlideIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToSlide(currentSlideIndex - 1);
        } else if (e.key === 'Home') {
            goToSlide(0);
        } else if (e.key === 'End') {
            goToSlide(totalSlides - 1);
        }
    });

    // Sidebar triggers
    menuToggleBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    });

    const closeSidebar = () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    };

    sidebarCloseBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    tocList.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const index = parseInt(e.target.getAttribute('data-index'));
            goToSlide(index);
            closeSidebar();
        }
    });

    // Mode Selector (Presentation vs Isolated Case Study)
    modePresentation.addEventListener('click', () => {
        modePresentation.classList.add('active');
        modeCaseStudy.classList.remove('active');
        slidesViewport.classList.remove('hidden');
        caseStudyViewport.classList.add('hidden');
        document.querySelector('.app-footer').classList.remove('hidden');
    });

    modeCaseStudy.addEventListener('click', () => {
        modeCaseStudy.classList.add('active');
        modePresentation.classList.remove('active');
        slidesViewport.classList.add('hidden');
        caseStudyViewport.classList.remove('hidden');
        document.querySelector('.app-footer').classList.add('hidden');
        
        // Render Winforms prototype directly inside the isolated case study viewport
        renderWinformsApp(caseStudyViewport);
    });

    // Toast control
    setTimeout(() => {
        shortcutsToast.classList.add('show');
    }, 2000);

    const closeToast = () => {
        shortcutsToast.classList.remove('show');
    };
    closeToastBtn.addEventListener('click', closeToast);
    setTimeout(closeToast, 8000);

    // Initial navigation load
    goToSlide(0);


    // -------------------------------------------------------------
    // Slide-Specific Widget Trigger Engine
    // -------------------------------------------------------------
    function triggerSlideWidgets(slideIndex) {
        // Slide indices are 0-based
        if (slideIndex === 3) {
            initCohesionCouplingSim();
        } else if (slideIndex === 4) {
            initLayeredArchitecture();
        } else if (slideIndex === 5) {
            initClientServerSim();
        } else if (slideIndex === 7) {
            initDesignPatterns();
        } else if (slideIndex === 8) {
            initScalabilitySim();
        } else if (slideIndex === 11) {
            // Render WinForms simulator inside slide 12
            const container = document.getElementById('winform-screen');
            if (container) {
                renderWinformsApp(container);
            }
        }
    }


    // -------------------------------------------------------------
    // Widget 1: Cohesion & Coupling Simulator
    // -------------------------------------------------------------
    let cohesionState = 'high'; // 'high' or 'low'

    function initCohesionCouplingSim() {
        const btnHigh = document.getElementById('btn-high-modular');
        const btnLow = document.getElementById('btn-low-modular');
        
        if (!btnHigh || !btnLow) return;

        btnHigh.addEventListener('click', () => {
            if (cohesionState === 'high') return;
            cohesionState = 'high';
            btnHigh.classList.add('active');
            btnLow.classList.remove('active');
            drawCohesionCoupling();
        });

        btnLow.addEventListener('click', () => {
            if (cohesionState === 'low') return;
            cohesionState = 'low';
            btnLow.classList.add('active');
            btnHigh.classList.remove('active');
            drawCohesionCoupling();
        });

        drawCohesionCoupling();
    }

    function drawCohesionCoupling() {
        const svg = document.getElementById('coupling-canvas');
        if (!svg) return;
        svg.innerHTML = ''; // Clear SVG

        const width = svg.clientWidth || 400;
        const height = svg.clientHeight || 280;

        // Module Boundary Rects
        const modules = [
            { id: 1, cx: width * 0.22, cy: height * 0.5, r: 55, title: 'Auth Module' },
            { id: 2, cx: width * 0.5, cy: height * 0.5, r: 55, title: 'OCR Module' },
            { id: 3, cx: width * 0.78, cy: height * 0.5, r: 55, title: 'NLP Module' }
        ];

        // Draw boundaries
        modules.forEach(m => {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', m.cx - m.r);
            rect.setAttribute('y', m.cy - m.r - 10);
            rect.setAttribute('width', m.r * 2);
            rect.setAttribute('height', m.r * 2 + 20);
            rect.setAttribute('rx', '8');
            rect.setAttribute('fill', 'none');
            rect.setAttribute('stroke', 'rgba(255,255,255,0.08)');
            rect.setAttribute('stroke-width', '1.5');
            rect.setAttribute('stroke-dasharray', '5 4');
            svg.appendChild(rect);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', m.cx);
            text.setAttribute('y', m.cy - m.r - 20);
            text.setAttribute('fill', '#64748b');
            text.setAttribute('font-size', '10px');
            text.setAttribute('font-weight', '600');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = m.title;
            svg.appendChild(text);
        });

        // Generate Node Points inside modules
        const nodes = [];
        modules.forEach(m => {
            // Generate 4 nodes per module
            const offsets = [
                { x: -22, y: -22, desc: 'Login' },
                { x: 22, y: -18, desc: 'Hashing' },
                { x: -18, y: 22, desc: 'Verify' },
                { x: 20, y: 20, desc: 'Token' }
            ];
            
            if (m.id === 2) {
                offsets[0].desc = 'LoadImg';
                offsets[1].desc = 'Filter';
                offsets[2].desc = 'Extract';
                offsets[3].desc = 'Format';
            } else if (m.id === 3) {
                offsets[0].desc = 'Tokenize';
                offsets[1].desc = 'Embed';
                offsets[2].desc = 'Summary';
                offsets[3].desc = 'Score';
            }

            offsets.forEach((o, idx) => {
                nodes.push({
                    id: `${m.id}-${idx}`,
                    moduleId: m.id,
                    x: m.cx + o.x,
                    y: m.cy + o.y,
                    desc: o.desc
                });
            });
        });

        const linesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        if (cohesionState === 'high') {
            // High Cohesion: Strong connection inside each module
            nodes.forEach((n1, idx1) => {
                nodes.forEach((n2, idx2) => {
                    if (idx1 < idx2 && n1.moduleId === n2.moduleId) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', n1.x);
                        line.setAttribute('y1', n1.y);
                        line.setAttribute('x2', n2.x);
                        line.setAttribute('y2', n2.y);
                        line.setAttribute('stroke', '#06b6d4'); // Teal
                        line.setAttribute('stroke-width', '2');
                        line.setAttribute('opacity', '0.65');
                        linesGroup.appendChild(line);
                    }
                });
            });

            // Low Coupling: Very few dependencies between modules (e.g. 1 -> 2, 2 -> 3)
            const couplingDeps = [
                { from: '1-2', to: '2-0' }, // Verify -> LoadImg
                { from: '2-2', to: '3-0' }  // Extract -> Tokenize
            ];

            couplingDeps.forEach(dep => {
                const n1 = nodes.find(n => n.id === dep.from);
                const n2 = nodes.find(n => n.id === dep.to);
                if (n1 && n2) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', n1.x);
                    line.setAttribute('y1', n1.y);
                    line.setAttribute('x2', n2.x);
                    line.setAttribute('y2', n2.y);
                    line.setAttribute('stroke', '#f97316'); // Orange coupling line
                    line.setAttribute('stroke-width', '1.5');
                    line.setAttribute('stroke-dasharray', '4 3');
                    line.setAttribute('opacity', '0.7');
                    linesGroup.appendChild(line);
                }
            });

        } else {
            // Low Cohesion: Weak internal connections
            nodes.forEach((n1, idx1) => {
                nodes.forEach((n2, idx2) => {
                    if (idx1 < idx2 && n1.moduleId === n2.moduleId && Math.random() > 0.7) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', n1.x);
                        line.setAttribute('y1', n1.y);
                        line.setAttribute('x2', n2.x);
                        line.setAttribute('y2', n2.y);
                        line.setAttribute('stroke', '#06b6d4');
                        line.setAttribute('stroke-width', '1.2');
                        line.setAttribute('opacity', '0.3');
                        linesGroup.appendChild(line);
                    }
                });
            });

            // High Coupling: Chaotic dependencies across modules
            // Connect random nodes across different modules
            for (let i = 0; i < 16; i++) {
                const n1 = nodes[Math.floor(Math.random() * nodes.length)];
                const n2 = nodes[Math.floor(Math.random() * nodes.length)];
                if (n1.moduleId !== n2.moduleId) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', n1.x);
                    line.setAttribute('y1', n1.y);
                    line.setAttribute('x2', n2.x);
                    line.setAttribute('y2', n2.y);
                    line.setAttribute('stroke', '#ef4444'); // Red coupling line
                    line.setAttribute('stroke-width', '1.8');
                    line.setAttribute('opacity', '0.8');
                    linesGroup.appendChild(line);
                }
            }
        }

        // Draw Nodes
        nodes.forEach(n => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', n.x);
            circle.setAttribute('cy', n.y);
            circle.setAttribute('r', '7');
            circle.setAttribute('fill', cohesionState === 'high' ? '#0f172a' : '#1e293b');
            circle.setAttribute('stroke', cohesionState === 'high' ? '#06b6d4' : '#ef4444');
            circle.setAttribute('stroke-width', '2');
            
            // Tooltip
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = n.desc;
            circle.appendChild(title);

            nodesGroup.appendChild(circle);
        });

        svg.appendChild(linesGroup);
        svg.appendChild(nodesGroup);
    }


    // -------------------------------------------------------------
    // Widget 2: Layered Architecture Explorer
    // -------------------------------------------------------------
    const layerData = {
        presentation: {
            title: 'Presentation Layer',
            num: 1,
            role: 'Manages user interfaces, views, and captures client interactions (clicks, keyboard events, file dragging). It serves as the visual gatekeeper and accepts inputs to forward down the stack.',
            implementation: 'Constructed using C# WinForms elements. Handles client-side view states, password requirements checks, and updates progress bars during long processes.',
            components: ['LoginPage.cs', 'SignUp.cs', 'HomePage.cs', 'UploadPage.cs', 'UploadedPage.cs', 'MorePage.cs', 'SummeraizedPage.cs', 'AccountPage.cs']
        },
        business: {
            title: 'Business Logic Layer',
            num: 2,
            role: 'Enforces workflows, business logic boundaries, validation, OCR processing pipelines, and formats AI data. Translates visual commands from Presentation into structured database queries.',
            implementation: 'Contains classes that directly call the Windows registry, wrap external APIs, and execute local data summarization loops.',
            components: ['extractApi.cs', 'summarizeAPI.cs', 'Summarize.cs', 'FileDetails.cs', 'Root.cs']
        },
        data: {
            title: 'Data Access Layer',
            num: 3,
            role: 'Handles persistence queries, reads metadata indices, manages database client connection pools, and writes secure binaries to storage disks.',
            implementation: 'Interfaces with Microsoft SQL Server Express databases using ADO.NET query parameter structures.',
            components: ['DocuPixie.mdf', 'DocuPixie_log.ldf', 'Microsoft.Data.SqlClient', 'SQL Express']
        }
    };

    function initLayeredArchitecture() {
        const layers = Array.from(document.querySelectorAll('.arch-layer'));
        const emptyState = document.getElementById('layer-details-empty');
        const contentState = document.getElementById('layer-details-content');
        const detailNum = document.getElementById('detail-layer-num');
        const detailTitle = document.getElementById('detail-layer-title');
        const detailRole = document.getElementById('detail-layer-role');
        const detailImpl = document.getElementById('detail-layer-implementation');
        const detailComps = document.getElementById('detail-layer-components');

        if (layers.length === 0) return;

        layers.forEach(layer => {
            layer.addEventListener('click', () => {
                layers.forEach(l => l.classList.remove('active'));
                layer.classList.add('active');

                const layerKey = layer.getAttribute('data-layer');
                const data = layerData[layerKey];

                if (data) {
                    emptyState.classList.remove('active');
                    contentState.classList.add('active');

                    detailNum.textContent = data.num;
                    detailTitle.textContent = data.title;
                    detailRole.textContent = data.role;
                    detailImpl.textContent = data.implementation;

                    // Clear and populate component pills
                    detailComps.innerHTML = '';
                    data.components.forEach(comp => {
                        const li = document.createElement('li');
                        li.textContent = comp;
                        detailComps.appendChild(li);
                    });
                }
            });
        });
    }


    // -------------------------------------------------------------
    // Widget 3: Client-Server Simulator
    // -------------------------------------------------------------
    let isNetworkRunning = false;

    function initClientServerSim() {
        const btnLogin = document.getElementById('btn-sim-login');
        const btnOcr = document.getElementById('btn-sim-ocr');
        const packet = document.getElementById('network-packet');
        const nodeClient = document.getElementById('node-client');
        const nodeServer = document.getElementById('node-server');
        const logLines = document.getElementById('network-log-lines');

        if (!btnLogin || !btnOcr) return;

        function addLogLine(text, type = 'system') {
            const line = document.createElement('div');
            line.className = `log-line ${type}-line`;
            const time = new Date().toLocaleTimeString();
            line.textContent = `[${time}] ${text}`;
            logLines.appendChild(line);
            logLines.scrollTop = logLines.scrollHeight;
        }

        function runSimulation(requestType) {
            if (isNetworkRunning) return;
            isNetworkRunning = true;

            nodeClient.classList.add('active');
            nodeServer.classList.remove('active');
            packet.className = 'network-packet'; // Reset

            if (requestType === 'login') {
                addLogLine('Client: Initiating Authentication Request...', 'client');
                addLogLine('Client -> Server: Sending credentials packet: { email: "user@domain.com" }', 'system');
                
                // Trigger animation
                setTimeout(() => { packet.classList.add('send'); }, 50);

                setTimeout(() => {
                    nodeServer.classList.add('active');
                    addLogLine('Server: Credentials packet received. Running credentials comparison...', 'server');
                    addLogLine('Server -> DB: Querying user credentials record: SELECT * FROM Users WHERE Email = ...', 'system');
                    
                    setTimeout(() => {
                        addLogLine('Server: Match found. Hashing matches. Generating login session token.', 'server');
                        addLogLine('Server -> Client: Sending Auth Success Token (Status 200 OK)', 'system');
                        packet.className = 'network-packet'; // Reset
                        setTimeout(() => { packet.classList.add('reply'); }, 50);

                        setTimeout(() => {
                            nodeClient.classList.remove('active');
                            nodeServer.classList.remove('active');
                            addLogLine('Client: Authentication Token validated! Redirecting user to HomePage.', 'success');
                            isNetworkRunning = false;
                        }, 1500);

                    }, 1200);

                }, 1500);

            } else if (requestType === 'ocr') {
                addLogLine('Client: Uploading scanned image (invoice_2026.png) for OCR processing...', 'client');
                addLogLine('Client -> Server: Posting file multipart stream: 1.2 MB binary data', 'system');

                setTimeout(() => { packet.classList.add('send'); }, 50);

                setTimeout(() => {
                    nodeServer.classList.add('active');
                    addLogLine('Server: File received successfully. Instantiating Tesseract OCR Engine.', 'server');
                    addLogLine('Server: Running layout analysis & character segmentation...', 'server');
                    
                    setTimeout(() => {
                        addLogLine('Server: Text extracted (430 words). Forwarding text block to AI Summarizer API (NLP Model T5)...', 'server');
                        addLogLine('Server: API returned summary block (62 words). Writing metadata values to SQL database.', 'server');
                        addLogLine('Server -> Client: Responding with payload JSON details: { text: "...", summary: "..." }', 'system');
                        packet.className = 'network-packet';
                        setTimeout(() => { packet.classList.add('reply'); }, 50);

                        setTimeout(() => {
                            nodeClient.classList.remove('active');
                            nodeServer.classList.remove('active');
                            addLogLine('Client: OCR text and Summary loaded. Displaying details side-by-side.', 'success');
                            isNetworkRunning = false;
                        }, 1500);

                    }, 2200);

                }, 1500);
            }
        }

        btnLogin.addEventListener('click', () => runSimulation('login'));
        btnOcr.addEventListener('click', () => runSimulation('ocr'));
    }


    // -------------------------------------------------------------
    // Widget 4: UML Tabs Controller
    // -------------------------------------------------------------
    function initDesignPatterns() {
        const patterns = Array.from(document.querySelectorAll('.pattern-box'));
        const visualContainer = document.getElementById('pattern-visual-container');

        if (patterns.length === 0) return;

        patterns.forEach(pat => {
            pat.addEventListener('click', () => {
                patterns.forEach(p => p.classList.remove('active'));
                pat.classList.add('active');

                const key = pat.getAttribute('data-pattern');
                renderPatternVisual(key, visualContainer);
            });
        });

        // Trigger first pattern visual by default
        patterns[0].click();
    }

    function renderPatternVisual(patternKey, container) {
        container.innerHTML = ''; // Clear

        if (patternKey === 'singleton') {
            container.innerHTML = `
                <div class="singleton-visual">
                    <div class="client-dots">
                        <div class="client-dot" id="sing-c1">Client UI</div>
                        <div class="client-dot" id="sing-c2">Service Thread</div>
                        <div class="client-dot" id="sing-c3">API Logger</div>
                    </div>
                    <div class="network-line" style="width: 80px;">
                        <svg width="100%" height="20">
                            <line x1="0" y1="10" x2="80" y2="10" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
                        </svg>
                    </div>
                    <div class="singleton-node" id="sing-instance">
                        DBConnectionManager
                    </div>
                </div>
            `;
            
            // Add click action
            const instanceNode = container.querySelector('#sing-instance');
            instanceNode.style.cursor = 'pointer';
            instanceNode.addEventListener('click', () => {
                const clients = ['sing-c1', 'sing-c2', 'sing-c3'];
                clients.forEach((cId, idx) => {
                    const cNode = container.querySelector(`#${cId}`);
                    cNode.style.backgroundColor = 'rgba(6, 182, 212, 0.2)';
                    cNode.style.borderColor = 'var(--accent-teal)';
                    
                    setTimeout(() => {
                        cNode.style.backgroundColor = '';
                        cNode.style.borderColor = '';
                        instanceNode.style.transform = 'scale(1.08)';
                        setTimeout(() => { instanceNode.style.transform = ''; }, 150);
                    }, 400 + idx * 150);
                });
            });

            const tip = document.createElement('span');
            tip.style.fontSize = '10px';
            tip.style.color = 'var(--text-muted)';
            tip.style.marginTop = '1rem';
            tip.style.display = 'block';
            tip.textContent = '💡 Click the DBConnectionManager box to simulate concurrent connection requests mapping to the same instance!';
            container.appendChild(tip);

        } else if (patternKey === 'factory') {
            container.innerHTML = `
                <div class="factory-visual">
                    <div class="factory-core-node" id="factory-core">
                         DocumentFactory
                    </div>
                    <div class="network-line" style="width: 40px;">
                        <svg width="100%" height="20"><line x1="0" y1="10" x2="40" y2="10" stroke="rgba(255,255,255,0.15)" stroke-width="2"/></svg>
                    </div>
                    <div class="factory-outputs">
                        <div class="factory-output-node" id="fac-o1">PDFDoc</div>
                        <div class="factory-output-node" id="fac-o2">ImageDoc</div>
                        <div class="factory-output-node" id="fac-o3">TxtDoc</div>
                    </div>
                </div>
            `;

            const core = container.querySelector('#factory-core');
            core.style.cursor = 'pointer';
            core.addEventListener('click', () => {
                const outputs = ['fac-o1', 'fac-o2', 'fac-o3'];
                const randomOutput = outputs[Math.floor(Math.random() * outputs.length)];
                const outNode = container.querySelector(`#${randomOutput}`);
                
                core.style.transform = 'translateY(-2px)';
                setTimeout(() => { core.style.transform = ''; }, 100);

                outNode.style.backgroundColor = 'rgba(59, 130, 246, 0.25)';
                outNode.style.transform = 'scale(1.15)';
                
                setTimeout(() => {
                    outNode.style.backgroundColor = '';
                    outNode.style.transform = '';
                }, 800);
            });

            const tip = document.createElement('span');
            tip.style.fontSize = '10px';
            tip.style.color = 'var(--text-muted)';
            tip.style.marginTop = '1rem';
            tip.style.display = 'block';
            tip.textContent = '💡 Click DocumentFactory to produce dynamic document parser components depending on file extensions!';
            container.appendChild(tip);

        } else if (patternKey === 'observer') {
            container.innerHTML = `
                <div class="observer-visual">
                    <div class="subject-node" id="obs-subject">
                        UploadQueue (Subject)
                    </div>
                    <div class="observer-nodes">
                        <div class="observer-node" id="obs-n1">UI Tracker</div>
                        <div class="observer-node" id="obs-n2">Folder Indexer</div>
                        <div class="observer-node" id="obs-n3">Activity Log</div>
                    </div>
                </div>
            `;

            const subject = container.querySelector('#obs-subject');
            subject.addEventListener('click', () => {
                subject.style.transform = 'scale(0.95)';
                setTimeout(() => { subject.style.transform = ''; }, 100);

                const observers = ['obs-n1', 'obs-n2', 'obs-n3'];
                observers.forEach((obsId, idx) => {
                    setTimeout(() => {
                        const obsNode = container.querySelector(`#${obsId}`);
                        obsNode.classList.add('notified');
                        
                        setTimeout(() => {
                            obsNode.classList.remove('notified');
                        }, 1200);
                    }, idx * 200);
                });
            });

            const tip = document.createElement('span');
            tip.style.fontSize = '10px';
            tip.style.color = 'var(--text-muted)';
            tip.style.marginTop = '1rem';
            tip.style.display = 'block';
            tip.textContent = '💡 Click UploadQueue to broadcast task completion events to all registered UI & backend modules!';
            container.appendChild(tip);
        }
    }


    // -------------------------------------------------------------
    // Widget 5: Horizontal Scalability Simulator
    // -------------------------------------------------------------
    function initScalabilitySim() {
        const slider = document.getElementById('server-scale-slider');
        const countLabel = document.getElementById('lbl-server-count');
        const tputVal = document.getElementById('metric-throughput');
        const latVal = document.getElementById('metric-latency');
        const serversPool = document.getElementById('lb-servers-pool');

        if (!slider) return;

        function updateSimulation(serverCount) {
            countLabel.textContent = serverCount;

            // Compute performance values
            const baseTput = serverCount * 140;
            const noiseTput = Math.floor(Math.random() * 25) - 12;
            tputVal.textContent = `${baseTput + noiseTput} req/s`;

            const baseLat = Math.max(15, Math.floor(130 / serverCount));
            const noiseLat = Math.floor(Math.random() * 4) - 2;
            latVal.textContent = `${baseLat + noiseLat} ms`;

            // Draw server cards
            serversPool.innerHTML = '';
            for (let i = 1; i <= serverCount; i++) {
                const node = document.createElement('div');
                node.className = 'pool-server-node';
                node.innerHTML = `
                    <div style="font-weight:700">API-Server-${i}</div>
                    <div style="font-size:9px;opacity:0.8;margin-top:2px">Load: ${Math.floor(80 / serverCount)}%</div>
                `;
                serversPool.appendChild(node);
            }
        }

        slider.addEventListener('input', (e) => {
            updateSimulation(parseInt(e.target.value));
        });

        // Initial setup
        updateSimulation(parseInt(slider.value));

        // Periodic slight metrics noise for realistic dynamic presentation look
        setInterval(() => {
            if (currentSlideIndex === 8) {
                updateSimulation(parseInt(slider.value));
            }
        }, 3000);
    }


    // -------------------------------------------------------------
    // UML Tabs triggers
    // -------------------------------------------------------------
    const tabHeaders = Array.from(document.querySelectorAll('.tab-hdr-btn'));
    const tabPanes = Array.from(document.querySelectorAll('.tab-pane'));

    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            header.classList.add('active');
            const tabId = `tab-${header.getAttribute('data-tab')}`;
            document.getElementById(tabId).classList.add('active');
        });
    });


    // -------------------------------------------------------------
    // WinForms Desktop C# App Simulated Engine (DocuPixie Simulator)
    // -------------------------------------------------------------
    let userSessionEmail = null;
    let selectedSampleDoc = null;

    const sampleDocs = [
        {
            title: "TOS Contract Agreement.txt",
            summary: "This legal document outlines standard terms of service. Users agree to access limitations, copyright holdings, dispute arbitration procedures, liability caps, and termination guidelines. Core clauses assert full content ownership to the host and limit damages to $50.",
            text: "Terms of Service Agreement\n\nWelcome to our platform. By accessing or using our services, you agree to be bound by these Terms of Service. All content, trademarks, and logos contained herein are the exclusive property of the company and protected by copyright law.\n\nArbitration Clause: Any dispute, controversy, or claim arising out of or relating to this contract, including its formation or breach, shall be settled by binding arbitration in accordance with the rules of the Arbitration Association. The venue shall be Delaware.\n\nLimitation of Liability: Under no circumstances shall the company or its affiliates be liable for direct, indirect, incidental, or consequential damages exceeding the sum of $50 USD. The services are provided 'as is' without warranties of any kind.\n\nTermination: We reserve the right to suspend or terminate your account access at our sole discretion, without notice or liability, for conduct that violates these terms or is deemed harmful to other users."
        },
        {
            title: "Clinical Medical Report Abstract.txt",
            summary: "Clinical trial analysis of patient responses to therapy. The study reports high efficacy rates (84%) with minimal adverse impacts. It recommends continued trials on larger patient clusters for further validation.",
            text: "Clinical Patient Trial Abstract\n\nPatient Case Reference: CT-89021\nPrincipal Investigator: Dr. A. Mercer\n\nIntroduction: This study analyzes the therapeutic efficacy and patient tolerability of Compound X29 in patients presenting with moderate-to-severe symptoms. Over a 12-week trial period, 150 participants received standardized daily doses.\n\nObservations: Efficacy was observed in 84.6% of the primary cohort, indicating significant reduction in physiological stress indicators. Minor side effects including fatigue and headache were noted in 4.2% of patients, resolving within 48 hours without therapeutic intervention.\n\nConclusions: Compound X29 exhibits a high profile of efficacy and safety. The results warrant further stage-3 clinical research on larger population cohorts to confirm dosage limits and analyze long-term tolerance limits."
        },
        {
            title: "Physics Research Abstract.txt",
            summary: "Scientific research analyzing quantum entanglement properties in superconducting layers. The experiment confirms coherence retention under thermal stress, providing foundation concepts for quantum processor storage architectures.",
            text: "Superconducting Quantum Coherence Abstract\n\nResearchers: Dr. L. Chen, Prof. M. Vance\n\nAbstract: We investigate quantum entanglement decay rates in Josephson junction arrays fabricated from niobium-nitride thin films. By subjecting arrays to variable thermal stress levels, we measure coherence phase values using state-of-the-art interferometer sensors.\n\nFindings: Experimental results demonstrate that coherence values are preserved at temperatures below 1.2 Kelvin, showing negligible phase fluctuation. The resilience of the superconducting layer suggests that this materials configuration represents a viable candidate for physical qubits storage.\n\nFuture Work: Further trials are planned to minimize decoherence profiles caused by ambient microwave radiation, targeting developments in quantum storage devices."
        }
    ];

    function renderWinformsApp(targetContainer) {
        // Render Sign Up page as default
        userSessionEmail = null;
        selectedSampleDoc = null;
        showSignUpScreen(targetContainer);
    }

    function showSignUpScreen(container) {
        container.innerHTML = `
            <div class="wf-container">
                <div class="wf-form-sidebar">
                    <div class="wf-logo-area">
                        <div class="wf-logo-img">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <div class="wf-title-grp">
                            <h3>DocuPixie</h3>
                            <span>AI-Powered Scanner & Organizer</span>
                        </div>
                    </div>

                    <div>
                        <div class="wf-welcome-text">Welcome to DocuPixie..</div>
                        <div class="wf-fields-grp">
                            <input type="text" class="wf-field" id="wf-signup-email" value="E-mail" onfocus="if(this.value=='E-mail')this.value=''" onblur="if(this.value=='')this.value='E-mail'">
                            <input type="text" class="wf-field" id="wf-signup-pass" value="Password" onfocus="if(this.value=='Password'){this.value=''; this.type='password';}" onblur="if(this.value==''){this.value='Password'; this.type='text';}">
                            <input type="text" class="wf-field" id="wf-signup-confpass" value="Confirm Password" onfocus="if(this.value=='Confirm Password'){this.value=''; this.type='password';}" onblur="if(this.value==''){this.value='Confirm Password'; this.type='text';}">
                        </div>

                        <div class="wf-check-row">
                            <label for="wf-2fa-select">Enable Two-factor Verification?</label>
                            <select id="wf-2fa-select">
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>

                        <button class="wf-btn" id="wf-signup-btn">Sign up</button>
                    </div>

                    <button class="wf-link-btn" id="wf-goto-login-btn">Already have an account? Log in</button>
                </div>

                <div class="wf-form-graphic">
                    <img src="assets/signup_page.jpg" class="wf-graphic-bg" alt="graphic bg">
                </div>
            </div>
        `;

        // Signup execution
        container.querySelector('#wf-signup-btn').addEventListener('click', () => {
            const email = container.querySelector('#wf-signup-email').value.trim();
            const pass = container.querySelector('#wf-signup-pass').value;
            const conf = container.querySelector('#wf-signup-confpass').value;

            // Standard Email Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === 'E-mail' || !emailRegex.test(email)) {
                alert("WinForms C# Validation Alert:\nInvalid email format.");
                return;
            }

            // Password complexity: >=8, 1 uppercase, 1 lowercase, 1 number, 1 special char
            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (pass === 'Password' || !passRegex.test(pass)) {
                alert("WinForms C# Validation Alert:\nPassword must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character.");
                return;
            }

            if (pass !== conf) {
                alert("WinForms C# Validation Alert:\nPasswords do not match.");
                return;
            }

            // Success sign up
            userSessionEmail = email;
            alert(`WinForms SQLite DB Message:\nSignup Successful! Account registered for ${email}.`);
            showHomeScreen(container);
        });

        // Go to Login
        container.querySelector('#wf-goto-login-btn').addEventListener('click', () => {
            showLoginScreen(container);
        });
    }

    function showLoginScreen(container) {
        container.innerHTML = `
            <div class="wf-container">
                <div class="wf-form-sidebar">
                    <div class="wf-logo-area">
                        <div class="wf-logo-img">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <div class="wf-title-grp">
                            <h3>DocuPixie</h3>
                            <span>AI-Powered Scanner & Organizer</span>
                        </div>
                    </div>

                    <div>
                        <div class="wf-welcome-text">Enter Your Password...</div>
                        <div class="wf-fields-grp">
                            <input type="text" class="wf-field" id="wf-login-email" value="E-mail" onfocus="if(this.value=='E-mail')this.value=''" onblur="if(this.value=='')this.value='E-mail'">
                            <input type="text" class="wf-field" id="wf-login-pass" value="Password" onfocus="if(this.value=='Password'){this.value=''; this.type='password';}" onblur="if(this.value==''){this.value='Password'; this.type='text';}">
                        </div>
                        <button class="wf-btn" id="wf-login-btn">Continue</button>
                    </div>

                    <button class="wf-link-btn" id="wf-goto-signup-btn">Need an account? Sign up</button>
                </div>

                <div class="wf-form-graphic">
                    <img src="assets/login_page.jpg" class="wf-graphic-bg" alt="graphic bg">
                </div>
            </div>
        `;

        container.querySelector('#wf-login-btn').addEventListener('click', () => {
            const email = container.querySelector('#wf-login-email').value.trim();
            const pass = container.querySelector('#wf-login-pass').value;

            if (email === 'E-mail' || pass === 'Password' || pass.length === 0) {
                alert("WinForms Alert:\nPlease enter valid credentials.");
                return;
            }

            userSessionEmail = email;
            showHomeScreen(container);
        });

        container.querySelector('#wf-goto-signup-btn').addEventListener('click', () => {
            showSignUpScreen(container);
        });
    }

    function showHomeScreen(container) {
        container.innerHTML = `
            <div class="wf-app-layout">
                <!-- Navigation -->
                <div class="wf-nav-sidebar">
                    <div class="wf-nav-icon active" title="Dashboard">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <div class="wf-nav-icon" id="wf-nav-logout" title="Log Out">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </div>
                </div>

                <!-- Main view -->
                <div class="wf-main-content-panel">
                    <div class="wf-panel-header">
                        <div>
                            <h3>DocuPixie</h3>
                            <span style="color:var(--accent-teal)">AI-Powered Document Scanner & Organizer</span>
                        </div>
                        <span style="font-family:var(--font-mono)">User: ${userSessionEmail || 'guest@domain.com'}</span>
                    </div>

                    <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
                        <div class="grid-2col alignment-center">
                            <div>
                                <div class="wf-grid-buttons">
                                    <button class="wf-menu-action-btn" id="wf-btn-scan-view">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                        Scan & summarize
                                    </button>
                                    <button class="wf-menu-action-btn" style="background-color:#0d4b75">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                                        Share
                                    </button>
                                    <button class="wf-menu-action-btn" style="background-color:#0d4b75">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                        Save
                                    </button>
                                    <button class="wf-menu-action-btn" style="background-color:#0d4b75">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                        Manage
                                    </button>
                                </div>
                            </div>
                            <div style="display:flex; justify-content:center;">
                                <img src="assets/options_window.jpg" style="width:260px; height:260px; object-fit:cover; border-radius:12px; border:1px solid rgba(255,255,255,0.08)" alt="app graphic">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Scan View click
        container.querySelector('#wf-btn-scan-view').addEventListener('click', () => {
            showUploadScreen(container);
        });

        // Logout
        container.querySelector('#wf-nav-logout').addEventListener('click', () => {
            userSessionEmail = null;
            showLoginScreen(container);
        });
    }

    function showUploadScreen(container) {
        container.innerHTML = `
            <div class="wf-app-layout">
                <!-- Navigation -->
                <div class="wf-nav-sidebar">
                    <div class="wf-nav-icon active" id="wf-nav-back-home" title="Go Back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </div>
                </div>

                <!-- Main view -->
                <div class="wf-main-content-panel">
                    <div class="wf-panel-header">
                        <div>
                            <h3>Scan & Summarize</h3>
                            <span style="color:var(--text-secondary)">Drag and Drop a document file or select a mock sample below</span>
                        </div>
                    </div>

                    <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:1.5rem;">
                        <div class="wf-upload-area" id="wf-drag-area">
                            <div class="wf-upload-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </div>
                            <h4>Drag & Drop file here</h4>
                            <p>Supported formats: JPG, PNG, PDF, TXT</p>
                        </div>

                        <div>
                            <div style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:0.5rem;">Or Test with Sample Document Profiles:</div>
                            <div class="wf-sample-docs">
                                ${sampleDocs.map((doc, idx) => `
                                    <div class="wf-sample-card" data-doc-idx="${idx}">
                                        <strong>${doc.title}</strong>
                                        <span style="color:var(--text-muted); font-size:10px">${doc.text.substring(0, 50)}...</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Back trigger
        container.querySelector('#wf-nav-back-home').addEventListener('click', () => {
            showHomeScreen(container);
        });

        // Sample documents click
        const cards = Array.from(container.querySelectorAll('.wf-sample-card'));
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.getAttribute('data-doc-idx'));
                selectedSampleDoc = sampleDocs[idx];
                triggerOcrSequence(container, selectedSampleDoc);
            });
        });

        // Click drag area to open sample 1 by default
        container.querySelector('#wf-drag-area').addEventListener('click', () => {
            selectedSampleDoc = sampleDocs[0];
            triggerOcrSequence(container, selectedSampleDoc);
        });
    }

    function triggerOcrSequence(container, documentProfile) {
        // Overlay scanning modal
        const overlay = document.createElement('div');
        overlay.className = 'wf-scanning-overlay';
        overlay.innerHTML = `
            <div class="wf-spinner"></div>
            <div class="wf-scanning-text">Loading OCR Engine...</div>
            <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-secondary)" id="wf-scan-progress">0% complete</div>
        `;
        container.appendChild(overlay);

        const progressLabel = overlay.querySelector('#wf-scan-progress');
        const textLabel = overlay.querySelector('.wf-scanning-text');

        // Step 1: Loading
        setTimeout(() => {
            progressLabel.textContent = "25% complete";
            textLabel.textContent = "Extracting text using Tesseract OCR...";
            
            // Step 2: Extracting
            setTimeout(() => {
                progressLabel.textContent = "60% complete";
                textLabel.textContent = "Analyzing language structure...";
                
                // Step 3: Summarizing
                setTimeout(() => {
                    progressLabel.textContent = "90% complete";
                    textLabel.textContent = "Running AI text summarization (NLP model T5)...";
                    
                    // Step 4: Finish
                    setTimeout(() => {
                        overlay.remove();
                        showSummarizedScreen(container, documentProfile);
                    }, 800);

                }, 900);

            }, 900);

        }, 700);
    }

    function showSummarizedScreen(container, docProfile) {
        container.innerHTML = `
            <div class="wf-app-layout">
                <!-- Navigation -->
                <div class="wf-nav-sidebar">
                    <div class="wf-nav-icon active" id="wf-nav-back-upload" title="Go Back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </div>
                </div>

                <!-- Main view -->
                <div class="wf-main-content-panel">
                    <div class="wf-panel-header">
                        <div>
                            <h3>${docProfile.title}</h3>
                            <span style="color:var(--accent-teal)">OCR Processing and Text Summarization Complete!</span>
                        </div>
                    </div>

                    <div class="wf-ocr-split">
                        <!-- Raw Text -->
                        <div class="wf-text-preview-box">
                            <h4>Extracted Text (OCR)</h4>
                            <div>${docProfile.text}</div>
                        </div>

                        <!-- Summary -->
                        <div class="flex-column" style="height:280px">
                            <div class="wf-text-preview-box" style="flex:1; height:auto; border-color:var(--accent-teal)">
                                <h4>AI Generated Summary</h4>
                                <textarea id="wf-summary-edit" style="width:100%; height:140px; background:none; border:none; outline:none; color:var(--text-primary); font-family:var(--font-body); font-size:0.85rem; resize:none; line-height:1.5">${docProfile.summary}</textarea>
                            </div>
                            
                            <div class="wf-text-actions">
                                <button class="wf-btn" id="wf-btn-save-summary">Save Summary</button>
                                <button class="wf-btn wf-btn-secondary" id="wf-btn-add-tags">Add Tags</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.querySelector('#wf-nav-back-upload').addEventListener('click', () => {
            showUploadScreen(container);
        });

        container.querySelector('#wf-btn-save-summary').addEventListener('click', () => {
            const val = container.querySelector('#wf-summary-edit').value.trim();
            alert(`WinForms C# Save Status:\nSummary updated and saved to SQLite Database (DocuPixieDB) successfully!\nLength: ${val.length} characters.`);
            showHomeScreen(container);
        });

        container.querySelector('#wf-btn-add-tags').addEventListener('click', () => {
            const tag = prompt("Enter tag name:", "legal");
            if (tag) {
                alert(`Tag '${tag}' added to this document.`);
            }
        });
    }

});
