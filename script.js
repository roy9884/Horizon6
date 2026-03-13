document.addEventListener('DOMContentLoaded', () => {
    const ANCHOR_DATE = new Date(2024, 0, 1); // 2024-01-01 (Month is 0-indexed)
    
    const LANG_DICT = {
        ko: {
            weekdays: ['일', '월', '화', '수', '목', '금', '토'],
            monthYear: (y, m) => `${y}년 ${m + 1}월`,
            fullDate: (y, m, d, w) => `${y}년 ${m + 1}월 ${d}일 (${w}요일)`,
            ui: {
                subtitle: "7일제 달력을 넘어선 새로운 6일제 캘린더 시스템",
                settingsBtn: "⚙️ 설정",
                settingsDesc: "색상 / 언어 / 요일명",
                selectedDayTitle: "선택된 날짜의 요일",
                searchDateTitle: "날짜 검색하기",
                anchorDateTxt: "기준일: 2024년 1월 1일 (Day 1)",
                todayBtn: "오늘로 이동",
                tab7Btn: "7일제 달력 (표준)",
                tab6Btn: "6일제 달력 (Horizon 6)"
            }
        },
        en: {
            weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthYear: (y, m) => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${months[m]} ${y}`;
            },
            fullDate: (y, m, d, w) => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${months[m]} ${d}, ${y} (${w})`;
            },
            ui: {
                subtitle: "A new 6-day calendar system beyond the 7-day week",
                settingsBtn: "⚙️ Settings",
                settingsDesc: "Color / Language / Day Names",
                selectedDayTitle: "Selected Day",
                searchDateTitle: "Search Date",
                anchorDateTxt: "Anchor Date: Jan 1, 2024 (Day 1)",
                todayBtn: "Go to Today",
                tab7Btn: "7-Day Calendar (Standard)",
                tab6Btn: "6-Day Calendar (Horizon 6)"
            }
        },
        ja: {
            weekdays: ['日', '月', '火', '水', '木', '金', '土'],
            monthYear: (y, m) => `${y}年 ${m + 1}月`,
            fullDate: (y, m, d, w) => `${y}年 ${m + 1}月 ${d}日 (${w})`,
            ui: {
                subtitle: "7日制カレンダーを超えた新しい6日制カレンダーシステム",
                settingsBtn: "⚙️ 設定",
                settingsDesc: "カラー / 言語 / 曜日名",
                selectedDayTitle: "選択された日付の曜日",
                searchDateTitle: "日付を検索",
                anchorDateTxt: "基準日: 2024年 1月 1日 (Day 1)",
                todayBtn: "今日へ移動",
                tab7Btn: "7日制カレンダー (標準)",
                tab6Btn: "6日制カレンダー (Horizon 6)"
            }
        },
        zh: {
            weekdays: ['日', '一', '二', '三', '四', '五', '六'],
            monthYear: (y, m) => `${y}年 ${m + 1}月`,
            fullDate: (y, m, d, w) => `${y}年 ${m + 1}月 ${d}日 (周${w})`,
            ui: {
                subtitle: "超越7天历的全新6天历系统",
                settingsBtn: "⚙️ 设置",
                settingsDesc: "颜色 / 语言 / 星期名",
                selectedDayTitle: "选中日期的星期",
                searchDateTitle: "搜索日期",
                anchorDateTxt: "基准日期: 2024年 1月 1日 (Day 1)",
                todayBtn: "回到今天",
                tab7Btn: "7天历 (标准)",
                tab6Btn: "6天历 (Horizon 6)"
            }
        },
        es: {
            weekdays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            monthYear: (y, m) => {
                const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return `${months[m]} ${y}`;
            },
            fullDate: (y, m, d, w) => {
                const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return `${d} de ${months[m]}, ${y} (${w})`;
            },
            ui: {
                subtitle: "Un nuevo sistema de calendario de 6 días más allá de la semana de 7 días",
                settingsBtn: "⚙️ Ajustes",
                settingsDesc: "Color / Idioma / Nombres",
                selectedDayTitle: "Día Seleccionado",
                searchDateTitle: "Buscar Fecha",
                anchorDateTxt: "Fecha Base: 1 Ene 2024 (Day 1)",
                todayBtn: "Ir a Hoy",
                tab7Btn: "Calendario de 7 días (Estándar)",
                tab6Btn: "Calendario de 6 días (Horizon 6)"
            }
        }
    };

    // Core Horizon 6 Logic
    function getHorizon6Day(targetDate) {
        const d1 = new Date(ANCHOR_DATE.getFullYear(), ANCHOR_DATE.getMonth(), ANCHOR_DATE.getDate());
        const d2 = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        
        const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
        const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
        
        const diffDays = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
        
        let modulo = diffDays % 6;
        if (modulo < 0) modulo += 6;
        
        return modulo + 1;
    }

    // Default Data
    const defaultSettings = {
        gridBorderColor: '#334155',
        gridBorderWidth: '0',
        gridBorderStyle: 'solid',
        cellBgColor: '#0f172a',
        cellTextColor: '#f8fafc',
        dayNameColor: '#94a3b8',
        language: 'en',
        dayNames: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6']
    };
    let h6Settings = { ...defaultSettings };
    let h6Memos = {}; // { "YYYY-MM-DD": { emoji: "🔥", text: "..." } }

    function formatDateKey(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    // Load / Save Data
    function loadData() {
        const storedSettings = localStorage.getItem('h6Settings');
        if (storedSettings) h6Settings = { ...defaultSettings, ...JSON.parse(storedSettings) };
        const storedMemos = localStorage.getItem('h6Memos');
        if (storedMemos) h6Memos = JSON.parse(storedMemos);
    }
    
    function saveData() {
        localStorage.setItem('h6Settings', JSON.stringify(h6Settings));
        localStorage.setItem('h6Memos', JSON.stringify(h6Memos));
    }

    // Elements
    const datePicker = document.getElementById('datePicker');
    const todayBtn = document.getElementById('todayBtn');
    const horizonDayDisplay = document.getElementById('horizonDayDisplay');
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const monthYear7 = document.getElementById('monthYear7');
    const prevMonth7 = document.getElementById('prevMonth7');
    const nextMonth7 = document.getElementById('nextMonth7');
    const grid7 = document.querySelector('.grid-7');

    const monthYear6 = document.getElementById('monthYear6');
    const prevMonth6 = document.getElementById('prevMonth6');
    const nextMonth6 = document.getElementById('nextMonth6');
    const grid6 = document.querySelector('.grid-6');

    // Modals
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    
    const gridBorderColor = document.getElementById('gridBorderColor');
    const gridBorderWidth = document.getElementById('gridBorderWidth');
    const gridBorderStyle = document.getElementById('gridBorderStyle');
    const cellBgColor = document.getElementById('cellBgColor');
    const cellTextColor = document.getElementById('cellTextColor');
    const dayNameColor = document.getElementById('dayNameColor');
    const languageSelect = document.getElementById('languageSelect');
    const customDays = [
        document.getElementById('customDay1'), document.getElementById('customDay2'),
        document.getElementById('customDay3'), document.getElementById('customDay4'),
        document.getElementById('customDay5'), document.getElementById('customDay6')
    ];
    const resetSettingsBtn = document.getElementById('resetSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    const memoModal = document.getElementById('memoModal');
    const closeMemoBtn = document.getElementById('closeMemoBtn');
    const memoModalDateTitle = document.getElementById('memoModalDateTitle');
    const memoEmoji = document.getElementById('memoEmoji');
    const memoText = document.getElementById('memoText');
    const deleteMemoBtn = document.getElementById('deleteMemoBtn');
    const saveMemoBtn = document.getElementById('saveMemoBtn');

    // State
    let selectedDate = new Date();
    let viewDate7 = new Date();
    let viewDate6 = new Date();
    let memoTargetDateStr = null;

    function init() {
        loadData();
        applySettings();
        
        const now = new Date();
        selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        viewDate7 = new Date(selectedDate);
        viewDate6 = new Date(selectedDate);
        
        updateSyncValues();
        renderAll();
    }

    function applySettings() {
        // Apply CSS Variables
        document.documentElement.style.setProperty('--grid-border-color', h6Settings.gridBorderColor);
        document.documentElement.style.setProperty('--grid-border-width', h6Settings.gridBorderWidth + 'px');
        document.documentElement.style.setProperty('--grid-border-style', h6Settings.gridBorderStyle);
        document.documentElement.style.setProperty('--cell-bg-color', h6Settings.cellBgColor);
        document.documentElement.style.setProperty('--cell-text-color', h6Settings.cellTextColor);
        document.documentElement.style.setProperty('--day-name-color', h6Settings.dayNameColor);

        // Update day names in headers for H6
        const h6Headers = document.querySelectorAll('.day-name.h6');
        h6Headers.forEach((el, index) => {
            el.textContent = h6Settings.dayNames[index] || `Day ${index + 1}`;
        });
        
        // Update day names for standard 7-Day calendar based on language
        const stdHeaders = document.querySelectorAll('.day-name:not(.h6)');
        const currentLangWeekdays = LANG_DICT[h6Settings.language].weekdays;
        stdHeaders.forEach((el, index) => {
            el.textContent = currentLangWeekdays[index];
        });

        // Update UI dynamic text strings
        const i18nElements = document.querySelectorAll('[data-i18n]');
        if (LANG_DICT[h6Settings.language] && LANG_DICT[h6Settings.language].ui) {
            const currentLangUi = LANG_DICT[h6Settings.language].ui;
            i18nElements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (currentLangUi[key]) {
                    el.textContent = currentLangUi[key];
                }
            });
        }
    }

    function populateSettingsUI() {
        gridBorderColor.value = h6Settings.gridBorderColor;
        gridBorderWidth.value = h6Settings.gridBorderWidth;
        gridBorderStyle.value = h6Settings.gridBorderStyle;
        cellBgColor.value = h6Settings.cellBgColor;
        cellTextColor.value = h6Settings.cellTextColor;
        dayNameColor.value = h6Settings.dayNameColor;
        languageSelect.value = h6Settings.language;

        customDays.forEach((input, i) => {
            input.value = h6Settings.dayNames[i] === `Day ${i+1}` ? '' : h6Settings.dayNames[i];
        });
    }

    function updateSyncValues() {
        datePicker.value = formatDateKey(selectedDate);

        const h6Num = getHorizon6Day(selectedDate);
        // Use custom day name if available
        const h6Name = h6Settings.dayNames[h6Num - 1] || `Day ${h6Num}`;
        horizonDayDisplay.textContent = h6Name;
        
        const dayStr = LANG_DICT[h6Settings.language].weekdays[selectedDate.getDay()];
        selectedDateDisplay.textContent = LANG_DICT[h6Settings.language].fullDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), dayStr);
    }

    function isSameDate(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }
    function isToday(d) { return isSameDate(d, new Date()); }

    // Navigation and Inputs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    datePicker.addEventListener('change', (e) => {
        if(!e.target.value) return;
        const [y, m, d] = e.target.value.split('-');
        selectedDate = new Date(y, m - 1, d);
        viewDate7 = new Date(selectedDate);
        viewDate6 = new Date(selectedDate);
        updateSyncValues();
        renderAll();
    });

    todayBtn.addEventListener('click', () => {
        const now = new Date();
        selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        viewDate7 = new Date(selectedDate);
        viewDate6 = new Date(selectedDate);
        updateSyncValues();
        renderAll();
    });

    prevMonth7.addEventListener('click', () => { viewDate7.setMonth(viewDate7.getMonth() - 1); render7Day(); });
    nextMonth7.addEventListener('click', () => { viewDate7.setMonth(viewDate7.getMonth() + 1); render7Day(); });
    prevMonth6.addEventListener('click', () => { viewDate6.setMonth(viewDate6.getMonth() - 1); render6Day(); });
    nextMonth6.addEventListener('click', () => { viewDate6.setMonth(viewDate6.getMonth() + 1); render6Day(); });

    function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }

    function renderAll() {
        render7Day();
        render6Day();
    }

    function onCellClick(cellDate) {
        selectedDate = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
        updateSyncValues();
        renderAll();
        
        // Open Memo Modal
        openMemoModal(selectedDate);
    }

    // Modal Logic
    settingsBtn.addEventListener('click', () => {
        populateSettingsUI();
        settingsModal.classList.add('active');
    });
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
    
    resetSettingsBtn.addEventListener('click', () => {
        h6Settings = { ...defaultSettings };
        populateSettingsUI();
        applySettings();
        saveData();
        updateSyncValues();
        renderAll();
    });

    saveSettingsBtn.addEventListener('click', () => {
        h6Settings.gridBorderColor = gridBorderColor.value;
        h6Settings.gridBorderWidth = gridBorderWidth.value;
        h6Settings.gridBorderStyle = gridBorderStyle.value;
        h6Settings.cellBgColor = cellBgColor.value;
        h6Settings.cellTextColor = cellTextColor.value;
        h6Settings.dayNameColor = dayNameColor.value;
        h6Settings.language = languageSelect.value;
        
        customDays.forEach((input, i) => {
            h6Settings.dayNames[i] = input.value.trim() || `Day ${i+1}`;
        });
        
        applySettings();
        saveData();
        updateSyncValues();
        renderAll();
        settingsModal.classList.remove('active');
    });

    function openMemoModal(d) {
        memoTargetDateStr = formatDateKey(d);
        const dayStr = LANG_DICT[h6Settings.language].weekdays[d.getDay()];
        memoModalDateTitle.textContent = LANG_DICT[h6Settings.language].fullDate(d.getFullYear(), d.getMonth(), d.getDate(), dayStr);
        
        if (h6Memos[memoTargetDateStr]) {
            memoEmoji.value = h6Memos[memoTargetDateStr].emoji || '';
            memoText.value = h6Memos[memoTargetDateStr].text || '';
        } else {
            memoEmoji.value = '';
            memoText.value = '';
        }
        
        memoModal.classList.add('active');
    }

    closeMemoBtn.addEventListener('click', () => memoModal.classList.remove('active'));

    saveMemoBtn.addEventListener('click', () => {
        if (!memoTargetDateStr) return;
        const emoji = memoEmoji.value.trim();
        const text = memoText.value.trim();
        
        if (!emoji && !text) {
            delete h6Memos[memoTargetDateStr];
        } else {
            h6Memos[memoTargetDateStr] = { emoji, text };
        }
        
        saveData();
        renderAll();
        memoModal.classList.remove('active');
    });

    deleteMemoBtn.addEventListener('click', () => {
        if (!memoTargetDateStr) return;
        delete h6Memos[memoTargetDateStr];
        saveData();
        renderAll();
        memoModal.classList.remove('active');
    });

    // Renders
    function render7Day() {
        const y = viewDate7.getFullYear();
        const m = viewDate7.getMonth();
        monthYear7.textContent = LANG_DICT[h6Settings.language].monthYear(y, m);

        const cells = grid7.querySelectorAll('.calendar-cell');
        cells.forEach(c => c.remove());

        const firstDayIdx = new Date(y, m, 1).getDay();
        const daysInMon = getDaysInMonth(y, m);

        for (let i = 0; i < firstDayIdx; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-cell empty';
            grid7.appendChild(empty);
        }

        for (let d = 1; d <= daysInMon; d++) {
            const dt = new Date(y, m, d);
            const cell = createCell(dt, true);
            grid7.appendChild(cell);
        }
    }

    function render6Day() {
        const y = viewDate6.getFullYear();
        const m = viewDate6.getMonth();
        monthYear6.textContent = LANG_DICT[h6Settings.language].monthYear(y, m);

        const cells = grid6.querySelectorAll('.calendar-cell');
        cells.forEach(c => c.remove());

        const firstDayObj = new Date(y, m, 1);
        const daysInMon = getDaysInMonth(y, m);
        
        const h6FirstDay = getHorizon6Day(firstDayObj);
        const emptyCells = h6FirstDay - 1;

        for (let i = 0; i < emptyCells; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-cell empty';
            grid6.appendChild(empty);
        }

        for (let d = 1; d <= daysInMon; d++) {
            const dt = new Date(y, m, d);
            const cell = createCell(dt, false);
            grid6.appendChild(cell);
        }
    }

    function createCell(dateObj, is7DayGrid) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.textContent = dateObj.getDate();

        if (isToday(dateObj)) cell.classList.add('today');
        if (isSameDate(dateObj, selectedDate)) cell.classList.add('selected');

        const dateKey = formatDateKey(dateObj);
        if (h6Memos[dateKey] && h6Memos[dateKey].emoji) {
            const memoInd = document.createElement('div');
            memoInd.className = 'memo-indicator';
            memoInd.textContent = h6Memos[dateKey].emoji;
            cell.appendChild(memoInd);
        } else if (h6Memos[dateKey] && h6Memos[dateKey].text) {
             const memoInd = document.createElement('div');
             memoInd.className = 'memo-indicator';
             memoInd.textContent = '📝';
             cell.appendChild(memoInd);
        }

        const badge = document.createElement('div');
        badge.className = 'badge';
        
        if (is7DayGrid) {
            badge.classList.add('badge-h6');
            const h6Num = getHorizon6Day(dateObj);
            badge.textContent = h6Settings.dayNames[h6Num - 1] || `Day ${h6Num}`;
        } else {
            badge.classList.add('badge-std');
            badge.textContent = LANG_DICT[h6Settings.language].weekdays[dateObj.getDay()];
        }
        
        cell.appendChild(badge);

        cell.addEventListener('click', () => onCellClick(dateObj));
        return cell;
    }

    // Close Modals on overlay click
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
        if (e.target === memoModal) {
            memoModal.classList.remove('active');
        }
    });

    init();
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('SW registered: ', registration.scope);
        }).catch(err => {
            console.log('SW registration failed: ', err);
        });
    });
}
