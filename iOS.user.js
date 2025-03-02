// ==UserScript==
// @name         清爽一X
// @namespace    https://example.com/cleansX
// @version      1.2
// @description  过滤 x.com 上包含指定关键词的推文和通知
// @match        https://*.x.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量：过滤关键词数组
    let keywords = [];

    // 从存储中加载关键词（逗号分隔的字符串）
    async function loadKeywords() {
        const stored = await GM.getValue("keywords", "");
        if (stored) {
            keywords = stored.split(',').map(k => k.trim()).filter(k => k);
        } else {
            keywords = [];
        }
    }

    // 保存关键词到存储
    async function saveKeywords() {
        await GM.setValue("keywords", keywords.join(','));
    }

    // 弹出对话框让用户输入关键词
    async function setKeywords() {
        const input = prompt("请输入过滤关键词（多个关键词用逗号隔开）：", keywords.join(','));
        if (input !== null) {
            keywords = input.split(',').map(k => k.trim()).filter(k => k);
            await saveKeywords();
            alert("关键词已更新: " + keywords.join(', '));
            filterContent(); // 更新后立即执行过滤
        }
    }

    // 注册菜单命令（如果支持的话）
    if (typeof GM.registerMenuCommand !== "undefined") {
        GM.registerMenuCommand("设置过滤关键词", setKeywords);
    } else {
        // 如果不支持菜单命令，在 iOS 上添加浮动按钮
        addFloatingButton();
    }

    // 为 iOS 添加浮动按钮，以便设置过滤关键词
    function addFloatingButton() {
        // 检查是否在 iOS 环境（iPhone/iPad/iPod）
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            const btn = document.createElement('button');
            btn.innerText = '设置过滤关键词';
            btn.style.position = 'fixed';
            btn.style.bottom = '20px';
            btn.style.right = '20px';
            btn.style.zIndex = '9999';
            btn.style.padding = '10px 15px';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.backgroundColor = '#007AFF';
            btn.style.color = 'white';
            btn.style.fontSize = '14px';
            btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
            btn.addEventListener('click', setKeywords);
            document.body.appendChild(btn);
        }
    }

    // 过滤推文和通知的函数
    function filterContent() {
        if (keywords.length === 0) return;
        // 匹配所有推文和通知
        const elements = document.querySelectorAll('[data-testid="tweet"], [data-testid="notification"]');
        elements.forEach(el => {
            const text = el.innerText.toLowerCase();
            const shouldHide = keywords.some(kw => text.includes(kw.toLowerCase()));
            if (shouldHide) {
                el.style.display = 'none';
            }
        });
    }

    // 监控页面变化，过滤动态加载的内容
    const observer = new MutationObserver(() => {
        filterContent();
    });
    observer.observe(document.body, {childList: true, subtree: true});

    // 初次加载时，先读取关键词再过滤，并添加浮动按钮（如果必要）
    loadKeywords().then(() => {
        filterContent();
        // 如果没有菜单命令支持，再确保添加浮动按钮
        if (typeof GM.registerMenuCommand === "undefined") {
            addFloatingButton();
        }
    });

})();
