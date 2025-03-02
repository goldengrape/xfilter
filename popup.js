document.addEventListener('DOMContentLoaded', () => {
    const keywordInput = document.getElementById('keyword');
    const addButton = document.getElementById('add');
    const keywordList = document.getElementById('keywordList');
  
    // 加载已存储的关键词
    chrome.storage.sync.get({keywords: []}, (data) => {
      updateKeywordList(data.keywords);
    });
  
    // 添加关键词
    addButton.addEventListener('click', () => {
      const keyword = keywordInput.value.trim();
      if (!keyword) return;
      chrome.storage.sync.get({keywords: []}, (data) => {
        const keywords = data.keywords;
        if (!keywords.includes(keyword)) {
          keywords.push(keyword);
          chrome.storage.sync.set({keywords}, () => {
            updateKeywordList(keywords);
            keywordInput.value = '';
          });
        }
      });
    });
  
    // 更新显示的关键词列表
    function updateKeywordList(keywords) {
      keywordList.innerHTML = '';
      keywords.forEach((keyword) => {
        const li = document.createElement('li');
        li.textContent = keyword;
        // 添加删除按钮
        const removeButton = document.createElement('button');
        removeButton.textContent = '删除';
        removeButton.addEventListener('click', () => {
          chrome.storage.sync.get({keywords: []}, (data) => {
            const newKeywords = data.keywords.filter(k => k !== keyword);
            chrome.storage.sync.set({keywords: newKeywords}, () => {
              updateKeywordList(newKeywords);
            });
          });
        });
        li.appendChild(removeButton);
        keywordList.appendChild(li);
      });
    }
  });
  