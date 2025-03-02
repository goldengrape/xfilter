// ==UserScript==
// @name         清爽一X
// @namespace    https://example.com/cleansX
// @version      1.1
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
        if(stored) {
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

    // 注册菜单命令（在支持 GM.registerMenuCommand 的环境下可在扩展菜单中看到）
    if (typeof GM.registerMenuCommand !== "undefined") {
        GM.registerMenuCommand("设置过滤关键词", setKeywords);
    }

    // 过滤推文和通知的函数
    function filterContent() {
        if (keywords.length === 0) return;
        // 匹配所有推文和通知（不论是 <div>、<article> 等）
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

    // 初次加载时，先读取关键词再过滤
    loadKeywords().then(() => {
        filterContent();
    });

})();
