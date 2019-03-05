(function() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'get',
    'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',
    true
  );
  xhr.send(null);
  xhr.onload = function() {
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

  function xhrData() {
    var dataStr = JSON.parse(xhr.responseText);
    var data = dataStr.result.records;

    var btnZone = document.querySelector('.hot-zone');
    var infoContent = document.querySelector('.info');
    var zoneTitleName = document.querySelector('.zone-name');
    var pagination = document.querySelector('.pagination');
    var pageNumber = document.querySelector('#pageNum');
    var selection = document.querySelector('#zone');

    var selectList = [];
    for (var i = 0; i < data.length; i++) {
      var selectZone = data[i].Zone;
      selectList.push(selectZone);
    }

    var selected = [];
    selectList.forEach(function(value) {
      if (selected.indexOf(value) == -1) {
        selected.push(value);
      }
    });

    for (var i = 0; i < selected.length; i++) {
      var option = document.createElement('option');
      option.textContent = selected[i];
      selection.appendChild(option);
    }

    btnZone.addEventListener('click', hotZone);
    pagination.addEventListener('click', paginationClick);
    selection.addEventListener('change', selectedList);

    function queryZone(zoneName) {
      selected = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].Zone === zoneName) {
          selected.push(data[i]);
        }
      }
    }

    function hotZone(e) {
      if (e.target.nodeName == 'BUTTON') {
        queryZone(e.target.textContent);
        renderContent(1);
        console.log(selected);
      }
    }

    function selectedList(e) {
      var value = e.target.value;
      queryZone(value);
      renderContent(1);
    }

    var totalPage;
    var totalItem;
    var currentPage;
    var perPage = 4;

    function renderContent(page) {
      $('html,body').animate({ scrollTop: $('.zone-name').offset().top }, 1000);

      totalItem = selected.length;
      zoneTitleName.textContent = selected[0].Zone;

      totalPage = Math.ceil(totalItem / perPage);
      let startItem;
      let endItem;

      if (page == totalPage) {
        var remainingItem = totalItem - totalPage * perPage;
        if (remainingItem == 0) {
          startItem = (totalPage - 1) * perPage;
          endItem = totalItem;
        } else {
          startItem = (totalPage - 1) * perPage;
          endItem = totalItem;
        }
      } else {
        startItem = perPage * (page - 1);
        endItem = page * perPage;
      }
      // console.log('startItem:' + startItem, 'endItem:' + endItem, 'totalPage:' + totalPage);

      var tempHTML = '';
      for (var i = startItem; i < endItem; i++) {
        var name = selected[i].Name;
        var zone = selected[i].Zone;
        var openTime = selected[i].Opentime;
        var add = selected[i].Add;
        var tel = selected[i].Tel;
        var ticket = selected[i].Ticketinfo;
        var picture = selected[i].Picture1;
        if (ticket == '') {
          tempHTML +=
            '<li class="item"><div class="image-wrap"><div class="photo"><img src="' +
            picture +
            '" /></div><div class="title-wrap"><div class="name">' +
            name +
            '</div><div class="zone"><i class="fas fa-bookmark"></i>' +
            zone +
            '</div></div></div><div class="content-wrap"><p class="open-time"><i class="far fa-clock"></i>' +
            openTime +
            '</p><p class="address"><i class="fas fa-map-marker-alt"></i>' +
            add +
            '</p><p class="tel"><i class="fas fa-mobile-alt"></i>' +
            tel +
            '</p></div></li>';
        } else {
          tempHTML +=
            '<li class="item"><div class="image-wrap"><div class="photo"><img src="' +
            picture +
            '" /></div><div class="title-wrap"><div class="name">' +
            name +
            '</div><div class="zone"><i class="fas fa-bookmark"></i>' +
            zone +
            '</div></div><div class="ticket-wrap"><div class="triangle"></div><i class="far fa-star"></i><span>免費參觀</span></div></div><div class="content-wrap"><p class="open-time"><i class="far fa-clock"></i>' +
            openTime +
            '</p><p class="address"><i class="fas fa-map-marker-alt"></i>' +
            add +
            '</p><p class="tel"><i class="fas fa-mobile-alt"></i>' +
            tel +
            '</p></div></li>';
        }
      }
      infoContent.innerHTML = tempHTML;
      currentPage = page;
      renderPage();
      selectedPageBtn();
      selectedPageBtn();
    }

    function renderPage() {
      if (selected.length <= 0 || selected.length <= 6) {
        pagination.style.display = 'none';
      } else {
        pagination.style.display = 'block';
        if (totalPage > 0) {
          var tempNum = '';
          for (var i = 1; i < totalPage + 1; i++) {
            tempNum += '<a href="javascript:;" class="click-page-num">' + i + '</a>';
          }
          pageNumber.innerHTML = tempNum;
        }
      }
    }

    function selectedPageBtn() {
      var clickPageNum = document.querySelectorAll('.click-page-num');
      for (var i = 0; i < clickPageNum.length; i++) {
        if (i == currentPage - 1) {
          clickPageNum[i].classList.add('current');
        } else {
          clickPageNum[i].classList.remove('current');
        }
      }

      var btnStatus = document.querySelectorAll('.pageBtn a');
      if (currentPage == 1) {
        btnStatus[0].classList.add('disabled');
      } else {
        btnStatus[0].classList.remove('disabled');
      }
      if (currentPage == totalPage) {
        btnStatus[1].classList.add('disabled');
      } else {
        btnStatus[1].classList.remove('disabled');
      }
    }
    function paginationClick(e) {
      if (e.target.nodeName == 'A') {
        pageNum = Number(e.target.dataset.num);
        if (pageNum == 1) {
          currentPage++;
          renderContent(currentPage);
        } else if (pageNum == 0) {
          currentPage--;
          renderContent(currentPage);
        } else {
          e.target.textContent;
          currentPage = e.target.textContent;
          renderContent(currentPage);
        }
        // console.log(currentPage, pageNum);
      }
    }

    (function init() {
      var initTemp = '';
      for (var i = 0; i < data.length; i++) {
        if (data[i].Zone == '內門區') {
          zoneTitleName.textContent = '內門區';
          initTemp +=
            '<li class="item"><div class="image-wrap"><div class="photo"><img src="' +
            data[i].Picture1 +
            '" /></div><div class="title-wrap"><div class="name">' +
            data[i].Name +
            '</div><div class="zone"><i class="fas fa-bookmark"></i>' +
            data[i].Zone +
            '</div></div></div><div class="content-wrap"><p class="open-time"><i class="far fa-clock"></i>' +
            data[i].Opentime +
            '</p><p class="address"><i class="fas fa-map-marker-alt"></i>' +
            data[i].Add +
            '</p><p class="tel"><i class="fas fa-mobile-alt"></i>' +
            data[i].Tel +
            '</p></div></li>';
        }
        infoContent.innerHTML = initTemp;
      }
    })();

    $('#goTop').click(function() {
      $('html,body').animate(
        {
          scrollTop: 0
        },
        800
      );
      return false;
    });

    $('#goDown').click(function() {
      $('html,body').animate(
        {
          scrollTop: $('#popular').offset().top
        },
        800
      );
      return false;
    });

    $(window).scroll(function() {
      if ($(this).scrollTop() > 300) {
        $('#goTop').fadeIn('fast');
      } else {
        $('#goTop')
          .stop()
          .fadeOut('fast');
      }
    });
  }
})();
