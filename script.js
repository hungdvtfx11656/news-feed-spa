let srcList = {
  gnewsio: {
    name: "Gnews",
    code: "gnewsio",
    token: "4298f131eab1734841e3ac2d5e937479",
    topHeadlines: function () {
      return "https://gnews.io/api/v4/top-headlines?token=" + this.token;
    },
    search: function (keywords = "", lang = "", from = "", to = "") {
      if (keywords === "") {
        return this.topHeadlines();
      } else {
        return (
          "https://gnews.io/api/v4/search?q=" +
          keywords +
          "&lang=" +
          lang +
          "&from=" +
          from +
          "T" +
          Date().slice(16, 24) +
          "Z" +
          "&to=" +
          to +
          "T" +
          Date().slice(16, 24) +
          "Z" +
          "&token=" +
          this.token
        );
      }
    },
  },
  mediastackcom: {
    name: "Media stack",
    code: "mediastackcom",
    token: "b73e91003f05af2537923410370a7863",
    topHeadlines: function () {
      return "http://api.mediastack.com/v1/news?access_key=" + this.token;
    },
    search: function (keywords = "", lang = "", from = "", to = "") {
      if (keywords === "") {
        return this.topHeadlines();
      } else {
        return (
          "http://api.mediastack.com/v1/news?access_key=" +
          this.token +
          "&sources=" +
          lang +
          "&date=" +
          from +
          "," +
          to +
          "&keywords=" +
          keywords
        );
      }
    },
  },
};

/**
 * @description setup spinner loading following article get
 */
jQuery.ajaxSetup({
  beforeSend: function () {
    $("#quick_search").attr("placeholder", "Loading news...");
    $("#news_status").html(`
            <div class="inline-block">
            <div class="spinner-grow mx-2 text-black-50" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-grow mx-2 text-black-50" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-grow mx-2 text-black-50" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            </div>
        `);
    $("#news_cards_area").html("");
  },
  complete: function () {
    $("#quick_search").attr("placeholder", "Quick search...");
  },
  success: function () {},
});
/**
 * @description page loads
 */
$(document).ready(function () {
  wholeRequest();
  widgetRequest();
});

/**
 * @description side_bar_btn click
 */
$(document).ready(function () {
  $("#side_bar_btn").mouseenter(function () {
    $("#side_bar").toggleClass("side_bar_show");
  });
  $("#side_bar").mouseleave(function () {
    $("#side_bar").toggleClass("side_bar_show");
  });
});

/**
 * @description menu_headlines click
 */
$(document).ready(function () {
  $("#menu_headlines").click(function (e) {
    e.preventDefault();
    wholeRequest("");
  });
});
/**
 * @description menu_covid19 click
 */
$(document).ready(function () {
  $("#menu_covid19").click(function (e) {
    e.preventDefault();
    wholeRequest("covid19");
  });
});
/**
 * @description menu_business click
 */
$(document).ready(function () {
  $("#menu_business").click(function (e) {
    e.preventDefault();
    wholeRequest("business");
  });
});
/**
 * @description menu_technology click
 */
$(document).ready(function () {
  $("#menu_technology").click(function (e) {
    e.preventDefault();
    wholeRequest("technology");
  });
});
/**
 * @description menu_entertainment click
 */
$(document).ready(function () {
  $("#menu_entertainment").click(function (e) {
    e.preventDefault();
    wholeRequest("entertainment");
  });
});
/**
 * @description menu_sport click
 */
$(document).ready(function () {
  $("#menu_sport").click(function (e) {
    e.preventDefault();
    wholeRequest("sport");
  });
});
/**
 * @description menu_science click
 */
$(document).ready(function () {
  $("#menu_science").click(function (e) {
    e.preventDefault();
    wholeRequest("science");
  });
});
/**
 * @description menu_health click
 */
$(document).ready(function () {
  $("#menu_health").click(function (e) {
    e.preventDefault();
    wholeRequest("health");
  });
});
/**
 * @description menu_gnewsio click
 */
$(document).ready(function () {
  $("#menu_gnewsio").click(function (e) {
    e.preventDefault();
    singleRequest("gnewsio");
  });
});
/**
 * @description menu_mediastackcom click
 */
$(document).ready(function () {
  $("#menu_mediastackcom").click(function (e) {
    e.preventDefault();
    singleRequest("mediastackcom");
  });
});

/**
 * @description quick search trigger
 */
$(document).ready(function () {
  $("#quick_search_btn").click(function (e) {
    e.preventDefault();
    wholeRequest($("#quick_search").val());
    $("#quick_search").val("");
  });
});
$(document).ready(function () {
  $("#quick_search").on("keyup", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      wholeRequest($("#quick_search").val());
      $("#quick_search").val("");
    }
  });
});
/**
 * @description deep search trigger
 */
$(document).ready(function () {
  $("#deep_search_btn").click(function (e) {
    e.preventDefault();
    deepSearch();
  });
});

/**
 *
 * @param {string} src JSON source name
 */
function switchSrcObj(src) {
  let articlesArray;
  switch (src) {
    case "gnewsio":
      articlesArray = "articles";
      break;
    case "mediastackcom":
      articlesArray = "data";
      break;
    default:
      break;
  }
  return articlesArray;
}
/**
 *
 * @param {object} article object inside JSON
 * @param {string} src JSON source name
 * @returns html format of single news card
 */
function genrNewsCard(article, src) {
  let url, title, publishedAt, description, image, source;
  switch (src) {
    case "gnewsio":
      url = article.url;
      title = article.title;
      publishedAt = article.publishedAt.slice(0, 10) + " " + article.publishedAt.slice(11, 19);
      description = article.description;
      image = article.image;
      source = article.source.name;
      break;
    case "newsapiorg":
      url = article.url;
      title = article.title;
      publishedAt = article.publishedAt;
      description = article.description;
      image = article.urlToImage;
      source = source;
      break;
    case "mediastackcom":
      url = article.url;
      title = article.title;
      publishedAt = article.published_at.slice(0, 10) + " " + article.published_at.slice(11, 19);
      description = article.description;
      image = article.image;
      source = article.source;
      break;
    default:
      url = article.url;
      title = article.title;
      publishedAt = article.publishedAt;
      description = article.description;
      image = article.image;
      source = article.source.name;
      break;
  }
  return (
    '<div class="news_card">' +
    '<div class="content m-3">' +
    '<div class="row">' +
    '<div class="col-sm-7">' +
    '<div class="main_title">' +
    '<a class="url" target=”_blank” href="' +
    url +
    '">' +
    '<p class="title">' +
    title +
    "</p>" +
    "</a>" +
    "</div>" +
    '<div class="sub_title my-2">' +
    '<span class="published_at">' +
    publishedAt +
    "</span>" +
    "</div>" +
    '<div class="">' +
    '<p class="description mb-3 mb-md-0">' +
    description +
    "</p>" +
    "</div>" +
    "</div>" +
    '<div class="col-sm-5">' +
    '<div class="thumb">' +
    '<a class="url" target=”_blank” href="' +
    url +
    '">' +
    '<img class="" src="' +
    image +
    '" alt="">' +
    "</a>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="bottom_line px-3 py-2 d-sm-flex justify-content-between">' +
    '<div class="read_more">' +
    '<a class="url" target=”_blank” href="' +
    url +
    '">' +
    '<p>Read more on <span class="sourse_name">' +
    source +
    "</span></p>" +
    "</a>" +
    "</div>" +
    '<div class="social d-none d-sm-block">' +
    '<a href="#"><i class="fa fa-facebook-square"></i></a>' +
    '<a href="#"><i class="fa fa-twitter-square"></i></a>' +
    '<a href="#"><i class="fa fa-google-plus-square"></i></a>' +
    "</div>" +
    "</div>" +
    "</div>"
  );
}
/**
 *
 * @param {object} obj JSON object
 * @param {string} src JSON source name
 */
function genrNewsCardList(obj, src) {
  let html = "";
  let articlesArray = switchSrcObj(src);
  $(obj[articlesArray]).each(function (index, element) {
    html += genrNewsCard(this, src);
  });
  return html;
}
/**
 *
 * @param {object} article object inside JSON
 * @param {string} src JSON source
 * @returns html format of single news card
 */
function genrNewsWidgetLi(article, src) {
  let url, title, publishedAt, description, image, source;
  switch (src) {
    case "gnewsio":
      url = article.url;
      title = article.title;
      publishedAt = article.publishedAt.slice(0, 10);
      source = article.source.name;
      break;
    case "newsapiorg":
      url = article.url;
      title = article.title;
      publishedAt = article.publishedAt;
      source = source;
      break;
    case "mediastackcom":
      url = article.url;
      title = article.title;
      publishedAt = article.published_at.slice(0, 10);
      source = article.source;
      break;
    // case 'github':
    //     url = article.url;
    //     title = article.id;
    //     publishedAt = article.updated_at;
    //     source = url;
    //     break;
    default:
      url = article.url;
      title = article.title;
      publishedAt = article.publishedAt;
      description = article.description;
      image = article.image;
      source = article.source.name;
      break;
  }
  return (
    "<li>" +
    '<div class="main_title">' +
    '<a class="url" target=”_blank” href="' +
    url +
    '">' +
    '<p class="title">' +
    title +
    "</p>" +
    "</a>" +
    "</div>" +
    '<div class="sub_title d-flex justify-content-between">' +
    '<div class="read_more">' +
    '<a class="url" target=”_blank” href="' +
    url +
    '">' +
    '<p><span class="sourse_name">' +
    source +
    "</span></p>" +
    "</a>" +
    "</div>" +
    '<div class="published">' +
    '<span class="published_at">' +
    publishedAt +
    "</span>" +
    "</div>" +
    "</div>" +
    "</li>"
  );
}
/**
 *
 * @param {object} obj JSON object
 * @param {string} src JSON source
 * @param {number} no maximum number of news
 */
function genrNewsWidget(obj, src, no) {
  if (no === undefined || no < 5) {
    no = Infinity;
  }
  let articlesArray = switchSrcObj(src);
  let star =
    '<div class="widget">' +
    '<div class="widget_title">' +
    "<span>" +
    srcList[src].name +
    "</span>" +
    "</div>" +
    "<ul>";
  let middle = "";
  let end = "</ul>" + "</div>";
  $(obj[articlesArray]).each(function (index, element) {
    if (index < no) {
      middle += genrNewsWidgetLi(this, src);
    }
  });
  return star + middle + end;
}
/**
 *
 * @param {string} src JSON source name
 * @param {string} keywords endpoint
 */
function singleRequest(src, keywords) {
  $.ajax(srcList[src].search(keywords), {
    dataType: "json",
    success: function (data, status, xhr) {
      $("#news_cards_area").html(genrNewsCardList(data, src));
      $("#news_status").text(srcList[src].name);
    },
    error: function (jqXhr, textStatus, errorMessage) {
      $("#news_status").text("Error: " + errorMessage);
    },
  });
  // $('.api_title').text(srcList[src].name);
  // $.get(srcList[src].search(keywords), function(data) {
  //     $('#news_cards_area').html((genrNewsCardList(data, src)));
  // });
}
/**
 *
 * @param {string} keywords endpoint
 */
function wholeRequest(keywords) {
  // if (keywords === null || keywords === '' || keywords === undefined) {
  //     $('.api_title').text('Top headlines');
  // } else {
  //     $('.api_title').text(keywords);
  // }
  $.each(srcList, function (indexInArray, valueOfElement) {
    let src = this.code;
    $.ajax(srcList[src].search(keywords), {
      dataType: "json",
      success: function (data, status, xhr) {
        $("#news_cards_area").append(genrNewsCardList(data, src));
        if (keywords === null || keywords === "" || keywords === undefined) {
          $("#news_status").text("Top headlines");
        } else {
          $("#news_status").text(keywords);
        }
      },
      error: function (jqXhr, textStatus, errorMessage) {
        // $('.api_title').text('Error: ' + errorMessage);
      },
    });
    // $.get(srcList[src].search(keywords), function(data) {
    //     $('#news_cards_area').append((genrNewsCardList(data, src)));
    // });
  });
}
/**
 *
 * @param {string} keywords endpoint
 */
function widgetRequest(keywords) {
  $("#widgets_area").html("");
  $.each(srcList, function (indexInArray, valueOfElement) {
    let src = this.code;
    $.get(srcList[src].search(keywords), function (data) {
      $("#widgets_area").append(genrNewsWidget(data, src));
    });
  });
}
/**
 *
 * @param {string} keywords endpoint
 */
function deepSearch() {
  let keywords = $("#deep_search").val();
  let from = $("#search_from").val();
  let to = $("#search_to").val();
  let lang = "";
  if ($("#english_checkbox").prop("checked", true)) {
    lang = $("#english_checkbox").val();
  }
  $.each(srcList, function (indexInArray, valueOfElement) {
    let src = this.code;
    $.ajax(srcList[src].search(keywords, lang, from, to), {
      dataType: "json",
      success: function (data, status, xhr) {
        $("#news_cards_area").append(genrNewsCardList(data, src));
        if (keywords === null || keywords === "" || keywords === undefined) {
          $("#news_status").text("Search result");
        } else {
          $("#news_status").text('Search result for "' + keywords + '"');
        }
      },
      error: function (jqXhr, textStatus, errorMessage) {
        // $('.api_title').text('Error: ' + errorMessage);
      },
      // $.get(srcList[src].search(keywords, lang, from, to), function(data) {
      //     $('#news_cards_area').append((genrNewsCardList(data, src)));
    });
  });
  $("#deep_search").val("");
  $("#search_from").val("");
  $("#search_to").val("");
  $("#english_checkbox").prop("checked", true);
  $("#search_modal").toggleClass("show");
  $(".modal-backdrop").toggleClass("show");
}
