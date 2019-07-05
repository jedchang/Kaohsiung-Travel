# Kaohsiung-Travel

前端 API 串接 (高雄旅遊網-景點資料)

![image](https://img.shields.io/badge/JavaScript-exercise-brightgreen.svg)
![image](https://img.shields.io/badge/jQuery-exercise-brightgreen.svg)
![image](https://img.shields.io/badge/RWD-exercise-blue.svg)
![image](https://img.shields.io/badge/SASS-exercise-ff69b4.svg)

![images](https://github.com/jedchang/Kaohsiung-Travel/blob/master/preview-2.jpg)

### 獲取 API 資料

- 使用 `new XMLHttpRequest();` 取得 API
- `get` 讀取資料
- `send()` 送出連線
- `onload()` xhr 其中一個事件 onload，當確定資料有回傳時，就執行 function

```javascript
xhr.onload = function() {
  // 滿足兩者條件 - readyState == 4: 請求已完成，且響應已就緒 & status == 200: 交易成功
  var loader = document.querySelector('.loader');
  if (xhr.readyState == 4 && xhr.status == 200) {
    loader.style.display = 'none';
    console.log('成功讀取資料');
    xhrData();
  } else {
    loader.style.display = 'block';
    console.log('資料錯誤!!');
  }
};
```

### 資料設定

- `xhr.responseText` 獲得字符串形式的響應數據。
- `JSON.parse` 將 string 轉 object，方便撈取資料。
- 先撈出各區域的值並加入空陣列中，用 `forEach` 去判斷陣列裡面所有值是否有吻合，使用 `indexOf()` 會回傳 陣列中第一個被找到索引，若不存在於陣列中則回傳 `-1`

```javascript
/*---------- 撈出過濾為區域陣列  ----------*/
var selectList = [];
for (var i = 0; i < data.length; i++) {
  var selectZone = data[i].Zone;
  selectList.push(selectZone);
  // console.log(selectList);
}

/*----------  篩選重複區域  ----------*/
// 用 forEach() 去判斷陣列裡面所有值是否有吻合
// indexOf() 會回傳 陣列中第一個被找到索引，若不存在於陣列中則回傳 -1
var selected = [];
selectList.forEach(function(value) {
  // 如果 selected 陣列中有滿足第一個索引
  if (selected.indexOf(value) == -1) {
    selected.push(value);
  }
});
```

### 事件 event

- 將各功能獨立成 function
- `e.target.nodeName` 點擊判斷 HTML button 的屬性，符合才執行。
- `e.target.value` 點擊判斷 HTML button 的值，符合才執行。

```javascript
// 熱門行政區
function hotZone(e) {
  if (e.target.nodeName == 'BUTTON') {
    queryZone(e.target.textContent);
    renderContent(1);
    console.log(selected);
  }
}

// 下拉選單
function selectedList(e) {
  var value = e.target.value;
  queryZone(value);
  renderContent(1);
}
```

### 分頁效果

- 分別定義 totalPage、totalItem、currentPage、perPage = 4 (每頁出現 4 筆資料)。
- 計算共有幾頁，`totalPage = Math.ceil(totalItem / perPage);`
- 剩餘資料 = 總資料筆數 - (總頁數 \* 每頁 6 筆)
- 判斷分頁前後頁切換，使用 `e.target.data-*`，取得 HTML 原始頁面上定義的 data-num，0 為上頁，1 為下頁做判斷。

```javascript
// 判斷分頁切換
    function paginationClick(e) {
      // 點擊判斷 HTML a 的值 才執行
      if (e.target.nodeName == 'A') {
        // 向前向後按鈕，獲取到是字串 上頁0 下頁1 需轉數字
        pageNum = Number(e.target.dataset.num);
        console.log(e);
        // 如果獲取數字是1 當前頁1+1
        if (pageNum == 1) {
          currentPage++;
          renderContent(currentPage);
          // 如果獲取數字是0 當前頁1
        } else if (pageNum == 0) {
          currentPage--;
          renderContent(currentPage);
        } else {
          // 裡面的文字內容
          e.target.textContent;
          // 分頁 1、2...更多
          currentPage = e.target.textContent;
          renderContent(currentPage);
      }
    }
```

### 初始化頁面 & 增加動態滑動

- 讀取 API 時增加 loading 讀取畫面，並預先加入一組區域資料
- jQuery 增加選擇區域動態效果
