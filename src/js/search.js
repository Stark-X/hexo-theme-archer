// special thanks to https://blog.naaln.com/2016/07/hexo-with-algolia/

const initAlgolia = () => {
  $(document).ready(function() {
    let algoliaSettings = algolia
    let isAlgoliaSettingsValid =
      algoliaSettings.appId &&
      algoliaSettings.apiKey &&
      algoliaSettings.indexName

    if (!isAlgoliaSettingsValid) {
      window.console.error('Algolia Settings are invalid.')
      return
    }

    let search = instantsearch({
      appId: algoliaSettings.appId,
      apiKey: algoliaSettings.apiKey,
      indexName: algoliaSettings.indexName,
      searchFunction: function(helper) {
        let searchInput = $('#algolia-search-input').find('input')

        if (searchInput.val()) {
          helper.search()
        }
      }
    })

    // Registering Widgets
    ;[
      instantsearch.widgets.searchBox({
        container: '#algolia-search-input',
        placeholder: algoliaSettings.labels.input_placeholder
      }),

      instantsearch.widgets.hits({
        container: '#algolia-hits',
        hitsPerPage: algoliaSettings.hits.per_page || 10,
        templates: {
          item: function(data) {
            let link = data.permalink
              ? data.permalink
              : siteMeta.root + data.path
            return (
              '<a href="' +
              link +
              '" class="algolia-hit-item-link">' +
              data._highlightResult.title.value +
              '</a>'
            )
          },
          empty: function(data) {
            return (
              '<div id="algolia-hits-empty">' +
              algoliaSettings.labels.hits_empty.replace(
                /\$\{query}/,
                data.query
              ) +
              '</div>'
            )
          }
        },
        cssClasses: {
          item: 'algolia-hit-item'
        }
      }),

      instantsearch.widgets.stats({
        container: '#algolia-stats',
        templates: {
          body: function(data) {
            let stats = algoliaSettings.labels.hits_stats
              .replace(/\$\{hits}/, data.nbHits)
              .replace(/\$\{time}/, data.processingTimeMS)
            return (
              stats +
              '<span class="algolia-powered">' +
              '  <img src="' +
              siteMeta.root +
              'assets/algolia_logo.svg" alt="Algolia" />' +
              '</span>' +
              '<hr />'
            )
          }
        }
      }),

      instantsearch.widgets.pagination({
        container: '#algolia-pagination',
        scrollTo: false,
        showFirstLast: false,
        labels: {
          first: '<i class="fa fa-angle-double-left"></i>',
          last: '<i class="fa fa-angle-double-right"></i>',
          previous: '<i class="fa fa-angle-left"></i>',
          next: '<i class="fa fa-angle-right"></i>'
        },
        cssClasses: {
          root: 'pagination',
          item: 'pagination-item',
          link: 'page-number',
          active: 'current',
          disabled: 'disabled-item'
        }
      })
    ].forEach(search.addWidget, search)

    search.start()

    $('.popup-trigger').on('click', function(e) {
      e.stopPropagation()
      $('body')
        .append('<div class="search-popup-overlay algolia-pop-overlay"></div>')
        .css('overflow', 'hidden')
      $('.popup').toggle()
      $('#algolia-search-input')
        .find('input')
        .focus()
    })

    $('.popup-btn-close').click(function() {
      $('.popup').hide()
      $('.algolia-pop-overlay').remove()
      $('body').css('overflow', '')
    })
  })
}

initAlgolia()
