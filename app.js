/**
 * CaseFit Studio - Phone Case Visualizer & Customizer Engine
 * Fully dynamic multi-phone model renderer (POCO X7 Green, POCO X7 Black, iPhone 16, Samsung S25, POCO F6, Xiaomi 14)
 */

document.addEventListener('DOMContentLoaded', () => {

    // Canvas Elements & Context
    const canvas = document.getElementById('phoneCanvas');
    const ctx = canvas.getContext('2d');
    const canvasWrapper = document.getElementById('canvasWrapper');

    // UI Elements - Inputs & Controls
    const selectPhoneModel = document.getElementById('selectPhoneModel');
    const phoneInfoTitle = document.getElementById('phoneInfoTitle');
    const phoneInfoSub = document.getElementById('phoneInfoSub');
    const bodyColorPresets = document.getElementById('bodyColorPresets');
    const customBodyColor = document.getElementById('customBodyColor');

    // Image Upload & Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const imageControlsGroup = document.getElementById('imageControlsGroup');
    const activeImgThumb = document.getElementById('activeImgThumb');
    const fileNameText = document.getElementById('fileNameText');
    const btnRemoveImage = document.getElementById('btnRemoveImage');

    // Image Transform Sliders
    const sliderScale = document.getElementById('sliderScale');
    const sliderRotate = document.getElementById('sliderRotate');
    const sliderOpacity = document.getElementById('sliderOpacity');
    const selectBlend = document.getElementById('selectBlend');
    const valScale = document.getElementById('valScale');
    const valRotate = document.getElementById('valRotate');
    const valOpacity = document.getElementById('valOpacity');
    const btnCenterImage = document.getElementById('btnCenterImage');
    const btnFitImage = document.getElementById('btnFitImage');

    // Presets & Solid Color
    const presetCards = document.querySelectorAll('.preset-card');
    const colorPaletteItems = document.querySelectorAll('.color-palette-item');
    const customCaseColor = document.getElementById('customCaseColor');
    const customCaseColorHex = document.getElementById('customCaseColorHex');
    const materialRadios = document.querySelectorAll('input[name="material"]');

    // Text Accordion & Controls
    const toggleTextAccordion = document.getElementById('toggleTextAccordion');
    const textAccordionContent = document.getElementById('textAccordionContent');
    const inputCustomText = document.getElementById('inputCustomText');
    const selectTextFont = document.getElementById('selectTextFont');
    const colorText = document.getElementById('colorText');

    // Stage Toolbar
    const viewButtons = document.querySelectorAll('.view-btn');
    const chkGlassReflection = document.getElementById('chkGlassReflection');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const canvasZoomVal = document.getElementById('canvasZoomVal');

    // Action Buttons
    const btnResetAll = document.getElementById('btnResetAll');
    const btnExport = document.getElementById('btnExport');

    // Modal Export
    const exportModal = document.getElementById('exportModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnModalClose = document.getElementById('btnModalClose');
    const exportImgResult = document.getElementById('exportImgResult');
    const btnDownloadLink = document.getElementById('btnDownloadLink');
    const expPhoneModel = document.getElementById('expPhoneModel');
    const expMaterial = document.getElementById('expMaterial');
    const expScore = document.getElementById('expScore');

    // Compatibility Card Elements
    const scoreText = document.getElementById('scoreText');
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreStatusTitle = document.getElementById('scoreStatusTitle');
    const scoreBadge = document.getElementById('scoreBadge');
    const scoreDescription = document.getElementById('scoreDescription');
    const detectedColorsList = document.getElementById('detectedColorsList');

    // ==========================================
    // APP STATE CONFIGURATION
    // ==========================================
    const state = {
        phoneModel: 'poco_x7_green',
        bodyColor: '#9cd6b2', // Sage Mint Green (Poco x7 hijau.webp)
        viewMode: 'back', // 'back' or 'front'
        
        // Image settings
        userImage: null,
        imageLoaded: false,
        imgScale: 1.0,
        imgRotate: 0,
        imgOpacity: 1.0,
        imgBlendMode: 'normal',
        imgOffsetX: 0,
        imgOffsetY: 0,
        
        // Solid case / Pattern settings
        caseMode: 'preset', // 'upload', 'preset', 'color'
        solidColor: '#9cd6b2',
        material: 'clear', // 'clear', 'matte', 'glossy'
        glassReflection: true,

        // Custom Text
        text: '',
        textFont: 'Outfit',
        textColor: '#ffffff',

        // Viewport Zoom
        viewportZoom: 1.0,

        // Dragging state on canvas
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0
    };

    // Database Tipe Phone lengkap
    const phoneData = {
        poco_x7_green: {
            name: 'POCO X7 - Hijau Mint',
            sub: 'Body: Sage Mint Green Metallic | Camera Island: 4-Lens Squaricle Module',
            defaultColor: '#9cd6b2',
            cameraStyle: 'poco_x7_squaricle',
            aspectRatio: { w: 330, h: 670, r: 44 }
        },
        poco_x7_black: {
            name: 'POCO X7 - Hitam Obsidian',
            sub: 'Body: Deep Obsidian Black | Camera Island: Dark Metallic Squaricle',
            defaultColor: '#18181b',
            cameraStyle: 'poco_x7_squaricle',
            aspectRatio: { w: 330, h: 670, r: 44 }
        },
        poco_f6_yellow: {
            name: 'POCO F6 - Kuning Racing',
            sub: 'Body: Signature Racing Yellow | Camera Ring: Dual Dark Lens',
            defaultColor: '#f59e0b',
            cameraStyle: 'dual_ring',
            aspectRatio: { w: 330, h: 670, r: 40 }
        },
        iphone_16_titanium: {
            name: 'iPhone 16 Pro Max - Natural Titanium',
            sub: 'Body: Matte Titanium | Camera Island: Triple Lens Glass Island',
            defaultColor: '#a39e93',
            cameraStyle: 'iphone_triple',
            aspectRatio: { w: 340, h: 680, r: 46 }
        },
        samsung_s25_gray: {
            name: 'Samsung Galaxy S25 Ultra - Titanium Gray',
            sub: 'Body: Armor Aluminum Gray | Camera Lenses: Separate Floating Rings',
            defaultColor: '#475569',
            cameraStyle: 'samsung_floating',
            aspectRatio: { w: 340, h: 680, r: 20 } // Ultra sharp corners
        },
        xiaomi_14_green: {
            name: 'Xiaomi 14 - Jade Green',
            sub: 'Body: Glossy Jade Green | Camera Module: Leica Square Island',
            defaultColor: '#065f46',
            cameraStyle: 'xiaomi_leica',
            aspectRatio: { w: 330, h: 660, r: 38 }
        },
        redmi_12c_blue: {
            name: 'Redmi 12C - Ocean Blue',
            sub: 'Body: Deep Ocean Blue Matte | Camera Module: Dual Lens Square Island',
            defaultColor: '#1e3a5f',
            cameraStyle: 'redmi_12c_square',
            aspectRatio: { w: 330, h: 690, r: 36 }
        },
        poco_m6_pro_black: {
            name: 'POCO M6 Pro - Power Black',
            sub: 'Body: Sleek Power Black | Camera Module: Dual Large Lens Segment',
            defaultColor: '#1a1d24',
            cameraStyle: 'poco_m6_pro_dual',
            aspectRatio: { w: 330, h: 670, r: 34 }
        }
    };

    // Load initial default preset image
    loadPresetImage('assets/cyber_pattern.jpg');

    // ==========================================
    // EVENT LISTENERS FOR SWITCHING PHONES
    // ==========================================
    selectPhoneModel.addEventListener('change', (e) => {
        state.phoneModel = e.target.value;
        const info = phoneData[state.phoneModel];
        if (info) {
            phoneInfoTitle.textContent = info.name;
            phoneInfoSub.textContent = info.sub;
            state.bodyColor = info.defaultColor;
            customBodyColor.value = info.defaultColor;
            
            // Sync active color chip
            document.querySelectorAll('.color-chip').forEach(chip => {
                chip.classList.toggle('active', chip.dataset.color.toLowerCase() === info.defaultColor.toLowerCase());
            });
        }
        renderCanvas();
        updateScore();
    });

    bodyColorPresets.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-chip')) {
            document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            state.bodyColor = e.target.dataset.color;
            customBodyColor.value = state.bodyColor;
            renderCanvas();
            updateScore();
        }
    });

    customBodyColor.addEventListener('input', (e) => {
        state.bodyColor = e.target.value;
        document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
        renderCanvas();
        updateScore();
    });

    // Tabs Switch
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.dataset.tab;
            document.getElementById(targetId).classList.add('active');

            if (targetId === 'tabUpload') {
                state.caseMode = state.userImage ? 'upload' : state.caseMode;
            } else if (targetId === 'tabPresets') {
                state.caseMode = 'preset';
            } else if (targetId === 'tabSolidColor') {
                state.caseMode = 'color';
            }
            renderCanvas();
            updateScore();
        });
    });

    // File Upload
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    });

    function handleFileUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Silakan upload file berupa gambar (PNG, JPG, WEBP).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                state.userImage = img;
                state.imageLoaded = true;
                state.caseMode = 'upload';
                state.imgOffsetX = 0;
                state.imgOffsetY = 0;
                state.imgScale = 1.0;
                state.imgRotate = 0;

                activeImgThumb.src = evt.target.result;
                fileNameText.textContent = file.name;
                imageControlsGroup.classList.remove('hidden');

                sliderScale.value = 100;
                sliderRotate.value = 0;
                sliderOpacity.value = 100;
                valScale.textContent = '100%';
                valRotate.textContent = '0°';
                valOpacity.textContent = '100%';

                renderCanvas();
                updateScore();
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }

    btnRemoveImage.addEventListener('click', () => {
        state.userImage = null;
        state.imageLoaded = false;
        imageControlsGroup.classList.add('hidden');
        fileInput.value = '';
        state.caseMode = 'color';
        renderCanvas();
        updateScore();
    });

    // Image Controls Sliders
    sliderScale.addEventListener('input', (e) => {
        state.imgScale = e.target.value / 100;
        valScale.textContent = `${e.target.value}%`;
        renderCanvas();
    });

    sliderRotate.addEventListener('input', (e) => {
        state.imgRotate = parseInt(e.target.value);
        valRotate.textContent = `${e.target.value}°`;
        renderCanvas();
    });

    sliderOpacity.addEventListener('input', (e) => {
        state.imgOpacity = e.target.value / 100;
        valOpacity.textContent = `${e.target.value}%`;
        renderCanvas();
        updateScore();
    });

    selectBlend.addEventListener('change', (e) => {
        state.imgBlendMode = e.target.value;
        renderCanvas();
    });

    btnCenterImage.addEventListener('click', () => {
        state.imgOffsetX = 0;
        state.imgOffsetY = 0;
        renderCanvas();
    });

    btnFitImage.addEventListener('click', () => {
        state.imgOffsetX = 0;
        state.imgOffsetY = 0;
        state.imgScale = 1.4;
        sliderScale.value = 140;
        valScale.textContent = '140%';
        renderCanvas();
    });

    // Presets
    presetCards.forEach(card => {
        card.addEventListener('click', () => {
            presetCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const src = card.dataset.src;
            const presetType = card.dataset.presetType;

            if (src) {
                loadPresetImage(src);
            } else if (presetType) {
                generateCanvasPattern(presetType);
            }
        });
    });

    function loadPresetImage(src) {
        const img = new Image();
        img.onload = () => {
            state.userImage = img;
            state.imageLoaded = true;
            state.caseMode = 'preset';
            state.imgOffsetX = 0;
            state.imgOffsetY = 0;
            state.imgScale = 1.05;
            state.imgRotate = 0;
            renderCanvas();
            updateScore();
        };
        img.src = src;
    }

    function generateCanvasPattern(type) {
        const patCanvas = document.createElement('canvas');
        patCanvas.width = 400;
        patCanvas.height = 400;
        const pCtx = patCanvas.getContext('2d');

        if (type === 'carbon') {
            pCtx.fillStyle = '#1c1917';
            pCtx.fillRect(0, 0, 400, 400);
            pCtx.strokeStyle = '#292524';
            pCtx.lineWidth = 4;
            for (let i = -400; i < 800; i += 16) {
                pCtx.beginPath();
                pCtx.moveTo(i, 0);
                pCtx.lineTo(i + 400, 400);
                pCtx.stroke();
            }
        } else if (type === 'marble') {
            const grad = pCtx.createLinearGradient(0, 0, 400, 400);
            grad.addColorStop(0, '#fef08a');
            grad.addColorStop(0.5, '#d97706');
            grad.addColorStop(1, '#451a03');
            pCtx.fillStyle = grad;
            pCtx.fillRect(0, 0, 400, 400);
        } else if (type === 'anime') {
            pCtx.fillStyle = '#0f172a';
            pCtx.fillRect(0, 0, 400, 400);
            pCtx.fillStyle = '#1e293b';
            for (let i = 0; i < 400; i += 30) {
                pCtx.fillRect(i, 0, 15, 400);
            }
        } else if (type === 'gradient') {
            const grad = pCtx.createRadialGradient(200, 200, 20, 200, 200, 280);
            grad.addColorStop(0, '#06b6d4');
            grad.addColorStop(0.4, '#3b82f6');
            grad.addColorStop(0.8, '#8b5cf6');
            grad.addColorStop(1, '#ec4899');
            pCtx.fillStyle = grad;
            pCtx.fillRect(0, 0, 400, 400);
        }

        const img = new Image();
        img.onload = () => {
            state.userImage = img;
            state.imageLoaded = true;
            state.caseMode = 'preset';
            renderCanvas();
            updateScore();
        };
        img.src = patCanvas.toDataURL();
    }

    // Color Palette
    colorPaletteItems.forEach(item => {
        item.addEventListener('click', () => {
            state.solidColor = item.dataset.caseColor;
            state.caseMode = 'color';
            customCaseColor.value = state.solidColor;
            customCaseColorHex.value = state.solidColor;
            renderCanvas();
            updateScore();
        });
    });

    customCaseColor.addEventListener('input', (e) => {
        state.solidColor = e.target.value;
        customCaseColorHex.value = e.target.value;
        state.caseMode = 'color';
        renderCanvas();
        updateScore();
    });

    customCaseColorHex.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
            state.solidColor = e.target.value;
            customCaseColor.value = e.target.value;
            state.caseMode = 'color';
            renderCanvas();
            updateScore();
        }
    });

    // Material Finish
    materialRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.material = e.target.value;
            renderCanvas();
            updateScore();
        });
    });

    // Text Accordion
    toggleTextAccordion.addEventListener('click', () => {
        textAccordionContent.classList.toggle('hidden');
        document.querySelector('.acc-icon').style.transform = textAccordionContent.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    inputCustomText.addEventListener('input', (e) => {
        state.text = e.target.value;
        renderCanvas();
    });

    selectTextFont.addEventListener('change', (e) => {
        state.textFont = e.target.value;
        renderCanvas();
    });

    colorText.addEventListener('input', (e) => {
        state.textColor = e.target.value;
        renderCanvas();
    });

    // View Mode Switch (Back vs Front)
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.viewMode = btn.dataset.view;
            renderCanvas();
        });
    });

    chkGlassReflection.addEventListener('change', (e) => {
        state.glassReflection = e.target.checked;
        renderCanvas();
    });

    // Zoom Controls
    btnZoomIn.addEventListener('click', () => {
        state.viewportZoom = Math.min(1.5, state.viewportZoom + 0.1);
        updateViewportZoom();
    });

    btnZoomOut.addEventListener('click', () => {
        state.viewportZoom = Math.max(0.7, state.viewportZoom - 0.1);
        updateViewportZoom();
    });

    function updateViewportZoom() {
        canvasWrapper.style.transform = `scale(${state.viewportZoom})`;
        canvasZoomVal.textContent = `${Math.round(state.viewportZoom * 100)}%`;
    }

    // Canvas Dragging
    canvas.addEventListener('mousedown', (e) => {
        if (!state.userImage || state.caseMode === 'color') return;
        state.isDragging = true;
        state.dragStartX = e.clientX - state.imgOffsetX;
        state.dragStartY = e.clientY - state.imgOffsetY;
        canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!state.isDragging) return;
        state.imgOffsetX = e.clientX - state.dragStartX;
        state.imgOffsetY = e.clientY - state.dragStartY;
        renderCanvas();
    });

    window.addEventListener('mouseup', () => {
        if (state.isDragging) {
            state.isDragging = false;
            canvas.style.cursor = 'grab';
        }
    });

    // Reset All
    btnResetAll.addEventListener('click', () => {
        if (confirm('Apakah kamu yakin ingin mereset kustomisasi casing?')) {
            state.phoneModel = 'poco_x7_green';
            state.bodyColor = '#9cd6b2';
            selectPhoneModel.value = 'poco_x7_green';
            phoneInfoTitle.textContent = phoneData.poco_x7_green.name;
            phoneInfoSub.textContent = phoneData.poco_x7_green.sub;
            customBodyColor.value = '#9cd6b2';

            state.userImage = null;
            state.imageLoaded = false;
            imageControlsGroup.classList.add('hidden');
            state.caseMode = 'preset';
            loadPresetImage('assets/cyber_pattern.jpg');

            state.imgScale = 1.0;
            state.imgRotate = 0;
            state.imgOpacity = 1.0;
            state.imgOffsetX = 0;
            state.imgOffsetY = 0;

            inputCustomText.value = '';
            state.text = '';

            renderCanvas();
            updateScore();
        }
    });

    // Modal Export Trigger
    btnExport.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL('image/png');
        exportImgResult.src = dataUrl;
        btnDownloadLink.href = dataUrl;

        expPhoneModel.textContent = phoneData[state.phoneModel].name;
        expMaterial.textContent = state.material === 'clear' ? 'Clear TPU (Transparan)' : (state.material === 'matte' ? 'Matte Hardcase' : 'Tempered Glass (Glossy)');
        expScore.textContent = scoreStatusTitle.textContent;

        exportModal.classList.remove('hidden');
    });

    btnCloseModal.addEventListener('click', () => exportModal.classList.add('hidden'));
    btnModalClose.addEventListener('click', () => exportModal.classList.add('hidden'));

    // ==========================================
    // MULTI-MODEL DYNAMIC CANVAS RENDER ENGINE
    // ==========================================
    function renderCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const phone = phoneData[state.phoneModel] || phoneData.poco_x7_green;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const pWidth = phone.aspectRatio.w;
        const pHeight = phone.aspectRatio.h;
        const pRadius = phone.aspectRatio.r;

        const x = cx - pWidth / 2;
        const y = cy - pHeight / 2;

        if (state.viewMode === 'back') {
            drawPhoneBack(ctx, x, y, pWidth, pHeight, pRadius, phone);
        } else {
            drawPhoneFront(ctx, x, y, pWidth, pHeight, pRadius, phone);
        }
    }

    function drawPhoneBack(ctx, x, y, w, h, r, phone) {
        ctx.save();

        // 1. DROP SHADOW FOR PHONE
        ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
        ctx.shadowBlur = 35;
        ctx.shadowOffsetY = 18;

        ctx.beginPath();
        drawRoundedRect(ctx, x, y, w, h, r);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.restore();

        // 2. METALLIC FRAME BEZEL (PHONE EDGE)
        ctx.save();
        ctx.beginPath();
        drawRoundedRect(ctx, x - 3, y - 3, w + 6, h + 6, r + 2);
        const frameGrad = ctx.createLinearGradient(x, y, x + w, y + h);
        frameGrad.addColorStop(0, lightenDarkenColor(state.bodyColor, 40));
        frameGrad.addColorStop(0.5, state.bodyColor);
        frameGrad.addColorStop(1, lightenDarkenColor(state.bodyColor, -40));
        ctx.fillStyle = frameGrad;
        ctx.fill();
        ctx.restore();

        // 3. DRAW BASE PHONE BODY (UNDER CASE HOLE)
        ctx.save();
        ctx.beginPath();
        drawRoundedRect(ctx, x, y, w, h, r);
        ctx.clip();

        // Phone body native color
        const nativeBodyGrad = ctx.createLinearGradient(x, y, x + w, y + h);
        nativeBodyGrad.addColorStop(0, state.bodyColor);
        nativeBodyGrad.addColorStop(1, lightenDarkenColor(state.bodyColor, -30));
        ctx.fillStyle = nativeBodyGrad;
        ctx.fill();

        // Vertical Debossed POCO Logo on Bottom Left (Only for POCO models)
        if (state.phoneModel.includes('poco')) {
            ctx.save();
            ctx.font = '800 54px Outfit, sans-serif';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.textAlign = 'left';
            ctx.translate(x + 46, y + h - 50);
            ctx.rotate(-Math.PI / 2);
            ctx.letterSpacing = '6px';
            ctx.fillText('POCO', 0, 0);
            ctx.restore();
        }

        // 4. DRAW CASE LAYER WITH MODEL-SPECIFIC CAMERA CUTOUT HOLE
        ctx.save();
        ctx.beginPath();
        
        // Outer case boundary
        drawRoundedRectPath(ctx, x, y, w, h, r);
        
        // Inner camera hole cutout based on phone model
        drawCameraHoleCutoutPathCounterClockwise(ctx, phone, x, y, w, h);

        ctx.clip('evenodd'); // Creates seamless hole for camera module!

        // Draw Custom Image, Preset Pattern, or Solid Casing inside case boundary
        if (state.caseMode === 'color') {
            ctx.fillStyle = state.solidColor;
            ctx.globalAlpha = state.material === 'clear' ? 0.45 : 1.0;
            ctx.fillRect(x - 10, y - 10, w + 20, h + 20);
            ctx.globalAlpha = 1.0;
        } else if (state.userImage && state.imageLoaded) {
            ctx.save();
            ctx.globalAlpha = state.imgOpacity;
            ctx.globalCompositeOperation = state.imgBlendMode;

            const imgW = state.userImage.width * state.imgScale;
            const imgH = state.userImage.height * state.imgScale;
            const imgX = x + w / 2 + state.imgOffsetX;
            const imgY = y + h / 2 + state.imgOffsetY;

            ctx.translate(imgX, imgY);
            ctx.rotate((state.imgRotate * Math.PI) / 180);
            ctx.drawImage(state.userImage, -imgW / 2, -imgH / 2, imgW, imgH);
            ctx.restore();
        }

        // Apply Material Textures to Case Surface
        if (state.material === 'clear') {
            const clearEdge = ctx.createLinearGradient(x, y, x + w, y);
            clearEdge.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            clearEdge.addColorStop(0.1, 'rgba(255, 255, 255, 0.05)');
            clearEdge.addColorStop(0.9, 'rgba(255, 255, 255, 0.05)');
            clearEdge.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
            ctx.fillStyle = clearEdge;
            ctx.fillRect(x - 10, y - 10, w + 20, h + 20);
        } else if (state.material === 'matte') {
            ctx.fillStyle = 'rgba(0,0,0,0.06)';
            ctx.fillRect(x - 10, y - 10, w + 20, h + 20);
        }

        // Custom Text on Case Surface
        if (state.text.trim() !== '') {
            ctx.save();
            ctx.font = `bold 28px ${state.textFont}, sans-serif`;
            ctx.fillStyle = state.textColor;
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 12;
            ctx.fillText(state.text.toUpperCase(), x + w / 2, y + h - 70);
            ctx.restore();
        }

        ctx.restore(); // Unclip Case Layer

        // 5. CAMERA MODULE ISLAND FOR SPECIFIC PHONE MODEL
        drawCameraIslandForModel(ctx, phone, x, y, w, h);

        // 6. PROTECTIVE CASE LIP BORDER
        ctx.save();
        ctx.beginPath();
        drawRoundedRect(ctx, x, y, w, h, r);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // 7. GLASS REFLECTION OVERLAY 3D
        if (state.glassReflection) {
            ctx.save();
            ctx.beginPath();
            drawRoundedRect(ctx, x, y, w, h, r);
            ctx.clip();

            ctx.beginPath();
            ctx.moveTo(x - 60, y);
            ctx.lineTo(x + w + 60, y + h / 2);
            ctx.lineTo(x + w + 60, y + h / 2 + 130);
            ctx.lineTo(x - 60, y + 130);
            ctx.closePath();
            const glassGrad = ctx.createLinearGradient(x, y, x + w, y + h);
            glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
            glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
            ctx.fillStyle = glassGrad;
            ctx.fill();
            ctx.restore();
        }

        ctx.restore(); // Unclip Outer Phone
    }

    // Dynamic Camera Hole Cutout Path for each phone model
    function drawCameraHoleCutoutPathCounterClockwise(ctx, phone, x, y, w, h) {
        if (phone.cameraStyle === 'poco_x7_squaricle') {
            const camW = 168, camH = 168, camR = 48;
            const camX = x + (w - camW) / 2;
            const camY = y + 36;
            drawRoundedRectPathCounterClockwise(ctx, camX, camY, camW, camH, camR);
        } else if (phone.cameraStyle === 'iphone_triple') {
            const camW = 148, camH = 148, camR = 36;
            const camX = x + 24;
            const camY = y + 24;
            drawRoundedRectPathCounterClockwise(ctx, camX, camY, camW, camH, camR);
        } else if (phone.cameraStyle === 'xiaomi_leica') {
            const camW = 150, camH = 150, camR = 32;
            const camX = x + 24;
            const camY = y + 24;
            drawRoundedRectPathCounterClockwise(ctx, camX, camY, camW, camH, camR);
        } else if (phone.cameraStyle === 'dual_ring') {
            const camW = 120, camH = 175, camR = 36;
            const camX = x + 24;
            const camY = y + 24;
            drawRoundedRectPathCounterClockwise(ctx, camX, camY, camW, camH, camR);
        } else if (phone.cameraStyle === 'samsung_floating') {
            // Samsung S25 Ultra 5 individual camera cutouts
            const lX = x + 40;
            const rX = x + 105;
            const rad = 24;
            drawCircleCounterClockwise(ctx, lX, y + 50, rad);
            drawCircleCounterClockwise(ctx, lX, y + 115, rad);
            drawCircleCounterClockwise(ctx, lX, y + 180, rad);
            drawCircleCounterClockwise(ctx, rX, y + 70, 18);
            drawCircleCounterClockwise(ctx, rX, y + 135, 18);
        } else if (phone.cameraStyle === 'redmi_12c_square') {
            // Redmi 12C: 5 precision circular case hole cutouts (Top Lens, AI Badge, Flash LED, Bottom Lens, Fingerprint Sensor)
            const camX = x + 20;
            const camY = y + 24;
            drawCircleCounterClockwise(ctx, camX + 46, camY + 42, 23);   // 1. Top Main Lens Hole
            drawCircleCounterClockwise(ctx, camX + 32, camY + 72.5, 9.5); // 2. AI Badge Hole
            drawCircleCounterClockwise(ctx, camX + 60, camY + 72.5, 10); // 3. Flash LED Hole
            drawCircleCounterClockwise(ctx, camX + 46, camY + 103, 23);  // 4. Bottom Secondary Lens Hole
            drawCircleCounterClockwise(ctx, camX + 118, camY + 112, 18); // 5. Fingerprint Sensor Hole
        } else if (phone.cameraStyle === 'poco_m6_pro_dual') {
            // POCO M6 Pro Softcase Pro Camera: 4 precision circular hole cutouts
            const camX = x + 20;
            const camY = y + 24;
            drawCircleCounterClockwise(ctx, camX + 46, camY + 46, 28);  // Main 64MP OIS Lens
            drawCircleCounterClockwise(ctx, camX + 46, camY + 112, 26); // Ultra-wide Lens
            drawCircleCounterClockwise(ctx, camX + 112, camY + 44, 16); // Macro Lens
            drawCircleCounterClockwise(ctx, camX + 112, camY + 112, 15);// Flash LED Ring
        }
    }

    // Dynamic Camera Island Renderer based on Phone Model
    function drawCameraIslandForModel(ctx, phone, x, y, w, h) {
        if (phone.cameraStyle === 'poco_x7_squaricle') {
            const camW = 168, camH = 168, camR = 48;
            const camX = x + (w - camW) / 2;
            const camY = y + 36;
            drawPocoX7CameraIsland(ctx, camX, camY, camW, camH, camR);
        } else if (phone.cameraStyle === 'iphone_triple') {
            const camW = 148, camH = 148, camR = 36;
            const camX = x + 24;
            const camY = y + 24;
            drawIphone16CameraIsland(ctx, camX, camY, camW, camH, camR);
        } else if (phone.cameraStyle === 'samsung_floating') {
            drawSamsungS25CameraIsland(ctx, x, y);
        } else if (phone.cameraStyle === 'dual_ring') {
            const camW = 120, camH = 175, camR = 36;
            const camX = x + 24;
            const camY = y + 24;
            drawPocoF6CameraIsland(ctx, camX, camY, camW, camH, camR);
        } else if (phone.cameraStyle === 'xiaomi_leica') {
            const camW = 150, camH = 150, camR = 32;
            const camX = x + 24;
            const camY = y + 24;
            drawXiaomi14CameraIsland(ctx, camX, camY, camW, camH, camR);
        } else if (phone.cameraStyle === 'redmi_12c_square') {
            const camW = 156, camH = 145, camR = 30;
            const camX = x + 20;
            const camY = y + 24;
            drawRedmi12CCameraIsland(ctx, camX, camY, camW, camH, camR);
        } else if (phone.cameraStyle === 'poco_m6_pro_dual') {
            const camW = 160, camH = 160, camR = 32;
            const camX = x + 20;
            const camY = y + 24;
            drawPocoM6ProCameraIsland(ctx, camX, camY, camW, camH, camR);
        }
    }

    // POCO X7 Camera Island (Mint or Black)
    function drawPocoX7CameraIsland(ctx, cx, cy, cw, ch, cr) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;

        // Outer Metallic Bezel Ring
        ctx.beginPath();
        drawRoundedRect(ctx, cx, cy, cw, ch, cr);
        const isMint = state.phoneModel === 'poco_x7_green';
        const islandBezel = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
        if (isMint) {
            islandBezel.addColorStop(0, '#eefbf3');
            islandBezel.addColorStop(0.5, '#b9e5ca');
            islandBezel.addColorStop(1, '#81c098');
        } else {
            islandBezel.addColorStop(0, '#374151');
            islandBezel.addColorStop(0.5, '#1f2937');
            islandBezel.addColorStop(1, '#111827');
        }
        ctx.fillStyle = islandBezel;
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Inner Surface
        const margin = 5;
        ctx.beginPath();
        drawRoundedRect(ctx, cx + margin, cy + margin, cw - margin * 2, ch - margin * 2, cr - 4);
        const islandSurf = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
        if (isMint) {
            islandSurf.addColorStop(0, '#d1f2dd');
            islandSurf.addColorStop(1, '#9cd6b2');
        } else {
            islandSurf.addColorStop(0, '#1f2937');
            islandSurf.addColorStop(1, '#0f172a');
        }
        ctx.fillStyle = islandSurf;
        ctx.fill();

        // 4 Lenses in 2x2 Grid
        const lRadius = 26;
        const lGapX = 40;
        const lGapY = 40;
        const centerX = cx + cw / 2;
        const centerY = cy + ch / 2;

        const lenses = [
            { x: centerX - lGapX, y: centerY - lGapY, type: 'main' },
            { x: centerX + lGapX, y: centerY - lGapY, type: 'sub' },
            { x: centerX - lGapX, y: centerY + lGapY, type: 'flash' },
            { x: centerX + lGapX, y: centerY + lGapY, type: 'sub' }
        ];

        lenses.forEach(l => {
            ctx.beginPath();
            ctx.arc(l.x, l.y, lRadius + 3, 0, Math.PI * 2);
            const lensRingGrad = ctx.createLinearGradient(l.x - lRadius, l.y - lRadius, l.x + lRadius, l.y + lRadius);
            lensRingGrad.addColorStop(0, '#ffffff');
            lensRingGrad.addColorStop(0.5, '#9ca3af');
            lensRingGrad.addColorStop(1, '#374151');
            ctx.fillStyle = lensRingGrad;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(l.x, l.y, lRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#0b0f19';
            ctx.fill();

            if (l.type === 'flash') {
                ctx.beginPath();
                ctx.arc(l.x, l.y, 14, 0, Math.PI * 2);
                ctx.fillStyle = '#1e293b';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(l.x, l.y, 9, 0, Math.PI * 2);
                ctx.fillStyle = '#fef08a';
                ctx.shadowColor = '#fef08a';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowColor = 'transparent';
            } else {
                ctx.beginPath();
                ctx.arc(l.x, l.y, 12, 0, Math.PI * 2);
                const opticsGrad = ctx.createRadialGradient(l.x - 4, l.y - 4, 1, l.x, l.y, 12);
                opticsGrad.addColorStop(0, '#38bdf8');
                opticsGrad.addColorStop(0.6, '#1e1b4b');
                opticsGrad.addColorStop(1, '#020617');
                ctx.fillStyle = opticsGrad;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(l.x - 5, l.y - 5, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.fill();
            }
        });

        // Center Text
        ctx.save();
        ctx.font = '700 8px Outfit, sans-serif';
        ctx.fillStyle = isMint ? '#4b5563' : '#9ca3af';
        ctx.textAlign = 'center';
        ctx.translate(centerX, centerY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('50MP OIS AI CAMERA', 0, 3);
        ctx.restore();

        ctx.restore();
    }

    // iPhone 16 Pro Max Camera Island
    function drawIphone16CameraIsland(ctx, cx, cy, cw, ch, cr) {
        ctx.save();
        ctx.beginPath();
        drawRoundedRect(ctx, cx, cy, cw, ch, cr);
        const glassGrad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
        glassGrad.addColorStop(0, '#cbd5e1');
        glassGrad.addColorStop(1, '#64748b');
        ctx.fillStyle = glassGrad;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fill();

        // 3 Triple Lenses
        const lenses = [
            { x: cx + 45, y: cy + 45 },
            { x: cx + 45, y: cy + 103 },
            { x: cx + 103, y: cy + 74 }
        ];

        lenses.forEach(l => {
            ctx.beginPath();
            ctx.arc(l.x, l.y, 25, 0, Math.PI * 2);
            ctx.fillStyle = '#0f172a';
            ctx.fill();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(l.x, l.y, 14, 0, Math.PI * 2);
            ctx.fillStyle = '#1e1b4b';
            ctx.fill();
        });

        ctx.restore();
    }

    // Samsung S25 Ultra Floating Camera Lenses
    function drawSamsungS25CameraIsland(ctx, x, y) {
        ctx.save();
        const lX = x + 40;
        const rX = x + 105;

        const mainLenses = [y + 50, y + 115, y + 180];
        mainLenses.forEach(ly => {
            ctx.beginPath();
            ctx.arc(lX, ly, 24, 0, Math.PI * 2);
            ctx.fillStyle = '#1e293b';
            ctx.shadowColor = 'rgba(0,0,0,0.4)';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(lX, ly, 13, 0, Math.PI * 2);
            ctx.fillStyle = '#020617';
            ctx.fill();
        });

        const subLenses = [y + 70, y + 135];
        subLenses.forEach(ly => {
            ctx.beginPath();
            ctx.arc(rX, ly, 18, 0, Math.PI * 2);
            ctx.fillStyle = '#1e293b';
            ctx.fill();
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2.5;
            ctx.stroke();
        });

        ctx.restore();
    }

    // POCO F6 Camera Island
    function drawPocoF6CameraIsland(ctx, cx, cy, cw, ch, cr) {
        ctx.save();
        ctx.beginPath();
        drawRoundedRect(ctx, cx, cy, cw, ch, cr);
        ctx.fillStyle = '#18181b';
        ctx.fill();

        [cy + 45, cy + 130].forEach(ly => {
            ctx.beginPath();
            ctx.arc(cx + cw / 2, ly, 30, 0, Math.PI * 2);
            ctx.fillStyle = '#090d16';
            ctx.fill();
            ctx.strokeStyle = '#eab308'; // POCO Yellow accent ring
            ctx.lineWidth = 3;
            ctx.stroke();
        });

        ctx.restore();
    }

    // Xiaomi 14 Leica Camera Island
    function drawXiaomi14CameraIsland(ctx, cx, cy, cw, ch, cr) {
        ctx.save();
        ctx.beginPath();
        drawRoundedRect(ctx, cx, cy, cw, ch, cr);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        // Leica text logo
        ctx.font = '700 12px Outfit, sans-serif';
        ctx.fillStyle = '#f43f5e';
        ctx.fillText('Leica', cx + 90, cy + 30);

        [ [cx + 40, cy + 50], [cx + 40, cy + 110], [cx + 100, cy + 110] ].forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos[0], pos[1], 22, 0, Math.PI * 2);
            ctx.fillStyle = '#020617';
            ctx.fill();
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2.5;
            ctx.stroke();
        });

        ctx.restore();
    }

    // Redmi 12C 5-Hole Precision Casing Camera Module (Top Lens, AI Badge, Flash LED, Bottom Lens, Fingerprint Sensor)
    function drawRedmi12CCameraIsland(ctx, cx, cy, cw, ch, cr) {
        ctx.save();

        // 1. 3D Raised Pro Camera Protection Frame contour on case (Matching POCO M6 Pro style)
        ctx.beginPath();
        drawRoundedRect(ctx, cx, cy, cw, ch, cr);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        drawRoundedRect(ctx, cx - 1, cy - 1, cw + 2, ch + 2, cr + 1);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.lineWidth = 2;
        ctx.stroke();

        const m = 3;
        ctx.beginPath();
        drawRoundedRect(ctx, cx + m, cy + m, cw - m * 2, ch - m * 2, cr - 3);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const pillX = cx + 10;
        const pillY = cy + 10;
        const pillW = 72;
        const pillH = ch - 20;

        // --- 1. TOP CAMERA LENS (Hole #1: Main 50MP Lens) ---
        const lx1 = pillX + pillW / 2; // cx + 46
        const ly1 = pillY + 32;       // cy + 42
        const lr1 = 23;

        ctx.save();
        // 3D Raised Protection Bezel Ring around Top Lens Hole on Case
        ctx.beginPath();
        ctx.arc(lx1, ly1, lr1 + 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(lx1, ly1, lr1 + 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Dark Lens Base
        ctx.beginPath();
        ctx.arc(lx1, ly1, lr1, 0, Math.PI * 2);
        ctx.fillStyle = '#090d16';
        ctx.fill();

        // Metallic Inner Ring
        ctx.beginPath();
        ctx.arc(lx1, ly1, lr1 - 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Lens Optic Gradient (Cyan/Blue anti-reflection coat)
        ctx.beginPath();
        ctx.arc(lx1, ly1, 12, 0, Math.PI * 2);
        const mainOptics = ctx.createRadialGradient(lx1 - 3, ly1 - 3, 1, lx1, ly1, 12);
        mainOptics.addColorStop(0, '#38bdf8');
        mainOptics.addColorStop(0.5, '#1e1b4b');
        mainOptics.addColorStop(1, '#020617');
        ctx.fillStyle = mainOptics;
        ctx.fill();

        // Glass Glare Reflection Specular Highlight
        ctx.beginPath();
        ctx.arc(lx1 - 4, ly1 - 4, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
        ctx.restore();

        // --- 2. AI BADGE (Hole #2: Middle Left AI Icon) ---
        const midY = pillY + pillH / 2; // cy + 72.5
        const aix = pillX + 22; // cx + 32
        const aiy = midY;
        const air = 9.5;

        ctx.save();
        // 3D Bezel Ring around AI Hole on Case
        ctx.beginPath();
        ctx.arc(aix, aiy, air + 1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(aix, aiy, air, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.font = '700 9px Outfit, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AI', aix, aiy + 0.5);
        ctx.restore();

        // --- 3. LED FLASH (Hole #3: Middle Right Flash LED) ---
        const fx = pillX + pillW - 22; // cx + 60
        const fy = midY;
        const fr = 10;

        ctx.save();
        // 3D Bezel Ring around Flash Hole on Case
        ctx.beginPath();
        ctx.arc(fx, fy, fr + 1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(fx, fy, 7, 0, Math.PI * 2);
        const flashGrad = ctx.createRadialGradient(fx - 2, fy - 2, 1, fx, fy, 7);
        flashGrad.addColorStop(0, '#ffffff');
        flashGrad.addColorStop(0.5, '#fff7ed');
        flashGrad.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = flashGrad;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.restore();

        // --- 4. BOTTOM CAMERA LENS (Hole #4: Secondary Sensor) ---
        const lx2 = pillX + pillW / 2; // cx + 46
        const ly2 = pillY + pillH - 32; // cy + 103
        const lr2 = 23;

        ctx.save();
        // 3D Raised Protection Bezel Ring around Bottom Lens Hole on Case
        ctx.beginPath();
        ctx.arc(lx2, ly2, lr2 + 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(lx2, ly2, lr2 + 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Dark Lens Base
        ctx.beginPath();
        ctx.arc(lx2, ly2, lr2, 0, Math.PI * 2);
        ctx.fillStyle = '#090d16';
        ctx.fill();

        // Metallic Inner Ring
        ctx.beginPath();
        ctx.arc(lx2, ly2, lr2 - 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Lens Optic Gradient
        ctx.beginPath();
        ctx.arc(lx2, ly2, 11, 0, Math.PI * 2);
        const subOptics = ctx.createRadialGradient(lx2 - 3, ly2 - 3, 1, lx2, ly2, 11);
        subOptics.addColorStop(0, '#67e8f9');
        subOptics.addColorStop(0.5, '#1e1b4b');
        subOptics.addColorStop(1, '#020617');
        ctx.fillStyle = subOptics;
        ctx.fill();

        // Glass Glare Highlight
        ctx.beginPath();
        ctx.arc(lx2 - 3, ly2 - 3, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        ctx.restore();

        // --- 5. FINGERPRINT SENSOR (Hole #5: Bottom Right) ---
        const fpx = cx + 118;
        const fpy = cy + 112;
        const fpr = 18;

        ctx.save();
        // 3D Outer Raised Bezel Ring around Fingerprint Sensor Cutout on Case
        ctx.beginPath();
        ctx.arc(fpx, fpy, fpr + 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(fpx, fpy, fpr + 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Sensor Base
        ctx.beginPath();
        ctx.arc(fpx, fpy, fpr, 0, Math.PI * 2);
        const fpGrad = ctx.createRadialGradient(fpx, fpy, 2, fpx, fpy, fpr);
        fpGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        fpGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.1)');
        fpGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = fpGrad;
        ctx.fill();

        // Fingerprint Sensor Ridges
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 0.9;
        for (let r = 4; r <= 13; r += 3) {
            ctx.beginPath();
            ctx.arc(fpx, fpy, r, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();

        ctx.restore();
    }

    // POCO M6 Pro Softcase Pro Camera (Raised 3D camera protection bump on case + 4 precision circular lens cutouts)
    function drawPocoM6ProCameraIsland(ctx, cx, cy, cw, ch, cr) {
        ctx.save();

        // 1. 3D Raised Pro Camera Protection Frame contour on case
        ctx.beginPath();
        drawRoundedRect(ctx, cx, cy, cw, ch, cr);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        drawRoundedRect(ctx, cx - 1, cy - 1, cw + 2, ch + 2, cr + 1);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        const m = 3;
        ctx.beginPath();
        drawRoundedRect(ctx, cx + m, cy + m, cw - m * 2, ch - m * 2, cr - 3);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // === 2. Individual Lens optics under cutouts + Protective Bezel Rings ===

        // --- Main 64MP OIS Camera Lens (Top-Left) ---
        const lx1 = cx + 46, ly1 = cy + 46, lr1 = 28;
        ctx.save();
        ctx.beginPath();
        ctx.arc(lx1, ly1, lr1, 0, Math.PI * 2);
        ctx.fillStyle = '#070a12';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(lx1, ly1, 14, 0, Math.PI * 2);
        const opt1 = ctx.createRadialGradient(lx1 - 4, ly1 - 4, 1, lx1, ly1, 14);
        opt1.addColorStop(0, '#a78bfa');
        opt1.addColorStop(0.5, '#1e1b4b');
        opt1.addColorStop(1, '#020617');
        ctx.fillStyle = opt1;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(lx1 - 5, ly1 - 5, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        ctx.restore();

        // Protective Metal Bezel Ring on case
        ctx.beginPath();
        ctx.arc(lx1, ly1, lr1 + 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // --- Ultra-wide Camera Lens (Bottom-Left) ---
        const lx2 = cx + 46, ly2 = cy + 112, lr2 = 26;
        ctx.save();
        ctx.beginPath();
        ctx.arc(lx2, ly2, lr2, 0, Math.PI * 2);
        ctx.fillStyle = '#070a12';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(lx2, ly2, 12, 0, Math.PI * 2);
        const opt2 = ctx.createRadialGradient(lx2 - 3, ly2 - 3, 1, lx2, ly2, 12);
        opt2.addColorStop(0, '#38bdf8');
        opt2.addColorStop(0.5, '#1e1b4b');
        opt2.addColorStop(1, '#020617');
        ctx.fillStyle = opt2;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(lx2 - 4, ly2 - 4, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        ctx.restore();

        // Protective Metal Bezel Ring on case
        ctx.beginPath();
        ctx.arc(lx2, ly2, lr2 + 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // --- Macro Camera Lens (Top-Right) ---
        const lx3 = cx + 112, ly3 = cy + 44, lr3 = 16;
        ctx.save();
        ctx.beginPath();
        ctx.arc(lx3, ly3, lr3, 0, Math.PI * 2);
        ctx.fillStyle = '#070a12';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(lx3, ly3, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#1e1b4b';
        ctx.fill();
        ctx.restore();

        // Bezel Ring on case
        ctx.beginPath();
        ctx.arc(lx3, ly3, lr3 + 1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // --- Flash LED Ring (Bottom-Right) ---
        const fx = cx + 112, fy = cy + 112, fr = 15;
        ctx.save();
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fillStyle = '#070a12';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(fx, fy, 8, 0, Math.PI * 2);
        const flashOpt = ctx.createRadialGradient(fx - 2, fy - 2, 1, fx, fy, 8);
        flashOpt.addColorStop(0, '#ffffff');
        flashOpt.addColorStop(0.5, '#f1f5f9');
        flashOpt.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = flashOpt;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.restore();

        // Flash Bezel Ring on case
        ctx.beginPath();
        ctx.arc(fx, fy, fr + 1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    function drawPhoneFront(ctx, x, y, w, h, r, phone) {
        ctx.save();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 35;
        ctx.shadowOffsetY = 18;

        ctx.beginPath();
        drawRoundedRect(ctx, x, y, w, h, r);
        ctx.fillStyle = '#090d16';
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        drawRoundedRect(ctx, x, y, w, h, r);
        ctx.clip();

        // Wallpaper Gradient
        const wallGrad = ctx.createLinearGradient(x, y, x + w, y + h);
        wallGrad.addColorStop(0, '#090d16');
        wallGrad.addColorStop(0.4, '#1e1b4b');
        wallGrad.addColorStop(0.8, '#451a03');
        wallGrad.addColorStop(1, '#090d16');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(x, y, w, h);

        if (state.phoneModel.includes('poco')) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x - 50, y + h * 0.2);
            ctx.lineTo(x + w + 50, y + h * 0.85);
            ctx.lineTo(x + w + 50, y + h * 0.95);
            ctx.lineTo(x - 50, y + h * 0.3);
            ctx.closePath();
            const xRibbonGrad = ctx.createLinearGradient(x, y, x + w, y + h);
            xRibbonGrad.addColorStop(0, '#ef4444');
            xRibbonGrad.addColorStop(0.5, '#f59e0b');
            xRibbonGrad.addColorStop(1, '#8b5cf6');
            ctx.fillStyle = xRibbonGrad;
            ctx.fill();
            ctx.restore();
        }

        // Punch Hole Selfie Cam
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 26, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Clock UI
        ctx.font = '700 48px Outfit, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 10;
        ctx.fillText('10:24', x + w / 2, y + 165);

        ctx.font = '500 14px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Minggu, 9 Agustus', x + w / 2, y + 195);

        // Glass Reflection
        if (state.glassReflection) {
            ctx.beginPath();
            ctx.moveTo(x - 40, y);
            ctx.lineTo(x + w + 40, y + h * 0.5);
            ctx.lineTo(x + w + 40, y + h * 0.5 + 100);
            ctx.lineTo(x - 40, y + 100);
            ctx.closePath();
            const frontGlass = ctx.createLinearGradient(x, y, x + w, y + h);
            frontGlass.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
            frontGlass.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
            ctx.fillStyle = frontGlass;
            ctx.fill();
        }

        ctx.restore();
    }

    // Path Helpers
    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    }

    function drawRoundedRectPath(ctx, x, y, width, height, radius) {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    function drawRoundedRectPathCounterClockwise(ctx, x, y, width, height, radius) {
        ctx.moveTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.closePath();
    }

    function drawCircleCounterClockwise(ctx, cx, cy, r) {
        ctx.moveTo(cx + r, cy);
        ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
        ctx.closePath();
    }

    function lightenDarkenColor(hex, amt) {
        let usePound = false;
        if (!hex || hex[0] !== "#") return hex || "#000000";
        hex = hex.slice(1);
        let num = parseInt(hex, 16);
        let r = (num >> 16) + amt;
        if (r > 255) r = 255; else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255; else if (b < 0) b = 0;
        let g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255; else if (g < 0) g = 0;
        return "#" + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    }

    // ==========================================
    // COLOR COMPATIBILITY SCORE CALCULATOR
    // ==========================================
    function updateScore() {
        let score = 96;
        let title = "Sangat Cocok & Harmonis!";
        let desc = `Perpaduan motif/warna dengan body <strong>${phoneData[state.phoneModel].name}</strong> menghasilkan kontras visual yang menonjol dan estetis.`;
        let badge = "Aesthetic Match";

        if (state.caseMode === 'color') {
            if (state.solidColor.toLowerCase() === state.bodyColor.toLowerCase()) {
                score = 98;
                title = "Monokrom Sempurna!";
                desc = "Warna casing persis senada dengan warna body HP. Memberikan kesan sleek, seamless, dan rapi.";
                badge = "Matching Color";
            } else if (state.solidColor === '#000000' || state.solidColor === '#ffffff') {
                score = 96;
                title = "Kontras Classic Neutral";
                desc = "Warna netral membuat aksen warna body dan modul kamera tampil menonjol (pop out).";
                badge = "Classic Contrast";
            } else {
                score = 88;
                title = "Gaya Enerjik & Bold";
                desc = "Kombinasi warna yang mencolok dan unik untuk kamu yang suka tampil beda.";
                badge = "Vibrant Style";
            }
        }

        scoreText.textContent = `${score}%`;
        scoreCircle.setAttribute('stroke-dasharray', `${score}, 100`);
        scoreStatusTitle.textContent = title;
        scoreBadge.textContent = badge;
        scoreDescription.innerHTML = desc;

        detectedColorsList.innerHTML = `
            <div class="detected-color-swatch" style="background:${state.bodyColor};" title="Warna Body HP"></div>
            <div class="detected-color-swatch" style="background:${state.solidColor};" title="Warna Casing Utama"></div>
            <div class="detected-color-swatch" style="background:#4b5563;" title="Aksen Modul Kamera"></div>
        `;
    }

    // Initial render
    renderCanvas();
    updateScore();

});
