"use strict";

//
//
//

const allTabs = document.querySelector("#all");
const currTab = document.querySelector("#one");

allTabs.addEventListener("click", () => {
  allTabs.classList.add("active-toggle");
  currTab.classList.remove("active-toggle");
});
currTab.addEventListener("click", () => {
  currTab.classList.add("active-toggle");
  allTabs.classList.remove("active-toggle");
});

//
//
//
var urlList = [];
var urlFav = [];

chrome.tabs.query({}, function (tabs) {
  //console.log("Hey its working");
  for (var i = 0; i < tabs.length; i++) {
    urlList[i] = tabs[i].url;
    urlFav[i] = tabs[i].favIconUrl;
  }
  // tabs.forEach(function (tab) {
  //   urlList.push(tab.url);
  // });
  var urlArray = new Array();
  mList(urlList, urlFav);

  const box = document.querySelectorAll(".box");
  const urlSelect = document.querySelectorAll(".url-select");

  box.forEach((e, i) => {
    e.addEventListener("click", function () {
      if (this.checked) {
        urlArray.push(e.value);
        urlSelect[i].classList.add("url-selected");
        // console.log(urlArray);
      } else {
        urlArray.splice(urlArray.indexOf(e.value), 1);
        urlSelect[i].classList.remove("url-selected");
        // console.log(urlArray);
      }
    });
  });

  for (let i = 0; i < urlSelect.length; i++) {
    urlSelect[i].classList.add("url-selected");
    urlSelect[i].addEventListener("click", () => {
      box[i].click();
    });
  }

  const btnArticleDownload = document.getElementById("Submit");

  btnArticleDownload.addEventListener("click", function () {
    var data = "";
    if (urlArray.length > 0) {
      for (var i = 0; i < urlArray.length; i++) {
        var data = data + urlArray[i] + "\n";
      }
      var textBlob = new Blob([data], { type: "text/plain" });
      var textFile = new File([textBlob], "urls.txt", {
        type: textBlob.type,
      });
      console.log(data);
      uploadFile(textFile);
    } else {
      alert("Please select atleast one website");
    }
  });

  const uploadFile = (file) => {
    const API_ENDPOINT = "https://scrapper-url.herokuapp.com/urlfile";
    const request = new XMLHttpRequest();
    const formData = new FormData();

    request.open("POST", API_ENDPOINT, true);
    request.onreadystatechange = () => {
      //

      //
      if (request.readyState === 4 && request.status === 200) {
        const driveUrl = request.responseText;
        console.log(driveUrl);

        const driveUrlLink = document.createElement("a");
        driveUrlLink.href = driveUrl;
        driveUrlLink.click();

        driveUrlLink.remove(driveUrlLink);
      }
      //
    };
    formData.append("", file);

    request.send(formData);
  };

  const select = document.querySelector("#file-select");

  // select.addEventListener("change", function (e) {
  //   const ele = console.log(ele);
  // });

  // const urlfilebtn = document.getElementById("u-t-d");

  select.addEventListener("change", function (e) {
    const ele = e.target.options.selectedIndex;

    // 0:default | 1:Txt | 2:html | 3:pdf
    if (ele === 2) {
      var data = "";
      var fstring =
        "<html><head><title> List of URLs |Algrow |EasyScrape </title> </head><body>";
      var estring = "</body></html>";
      if (urlArray.length > 0) {
        for (var i = 0; i < urlArray.length; i++) {
          var data =
            data +
            (i + 1) +
            ". " +
            "<a href=" +
            urlArray[i] +
            " target ='_blank'>" +
            urlArray[i] +
            "</a>" +
            "<br/>";
        }
        var htmlDoc = "" + fstring + data + estring;

        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        a.href = window.URL.createObjectURL(
          new Blob([htmlDoc], { type: "application/html" })
        );
        a.setAttribute("download", "List_of_open_urls.html");
        a.click();

        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
        select.value = "default";
      }
    }
  });

  // urlfilebtn.addEventListener("click", function () {
  //   var data = "";
  //   if (urlArray.length > 0) {
  //     for (var i = 0; i < urlArray.length; i++) {
  //       var data = data + (i + 1) + ". " + urlArray[i] + "\n";
  //     }

  //     const a = document.createElement("a");
  //     a.style.display = "none";
  //     document.body.appendChild(a);
  //     a.href = window.URL.createObjectURL(
  //       new Blob([data], { type: "text/plain" })
  //     );
  //     a.setAttribute("download", "List_of_open_urls.txt");
  //     a.click();

  //     window.URL.revokeObjectURL(a.href);
  //     document.body.removeChild(a);
  //   }
  // });

  function mList(urlList, urlFav) {
    var chkboxdiv = document.getElementById("url-list");
    for (var i = 0; i < urlList.length; i++) {
      console.log(urlList[i]);

      let x = `
      <div class="url-select">
        <img src='${
          urlFav[i] ? urlFav[i] : "./images/icon_128.png" // default favicon
        }' class="favicon"/>
        <p class="url">${urlList[i]}</p>
        <input class='box' type='checkbox' name='checkbox' value='${
          urlList[i]
        }' checked>
      </div>
      `;
      urlArray.push(urlList[i]);

      chkboxdiv.insertAdjacentHTML("afterbegin", x);

      // var box = document.createElement("input");
      // var label = document.createElement("label");
      // box.type = "checkbox";
      // box.checked = true;
      // box.value = urlList[i];
      // chkboxdiv.appendChild(document.createElement("br"));
      // chkboxdiv.appendChild(box);
      // chkboxdiv.appendChild(label);
      // label.append(document.createTextNode(urlList[i]));

      // addEventListener("click", function () {
      //   var values = [];

      //   console.log(box.value);
      //   // for (var i = 0, len = box.length; i < len; i++) {
      //   //   if (box[i].checked) {
      //   //     values.push(box[i].value);
      //   //     console.log(box[i].value);
      //   //   }
      //   // }
      // });

      // document.getElementById("url-list").innerHTML +=
      //   "<li>" + urlList[i] + "</li>";
    }
  }
  //console.log(typeof tab.url);
});
