<template>
  <div class="interactiveGraph-container">
    <!-- <h2>interactiveGraph</h2> -->
    <div style="height: 100%">
      <div id="graphArea"></div>
    </div>
    <!--all UI controls-->
    <div>
      <!--toolbar-->
      <div
        class="toolbarPanel igraph-dockable igraph-draggable"
        igraph-control-role="ToolbarCtrl"
        igraph-dock-position="B:-6,0"
      >
        <div class="toolbar"></div>
      </div>
      <!--info box-->
      <div
        class="infoPanel igraph-dockable igraph-draggable"
        igraph-control-role="InfoBoxCtrl"
        igraph-dock-position="A:10,80"
      >
        <div>
          <div class="infoPanel1"></div>
          <div class="infoPanel2">
            <span
              align="center"
              class="fa fa-close fa-lg btnCloseInfoPanel"
            ></span>
          </div>
        </div>
        <div class="infoBox"></div>
      </div>
      <!--search box-->
      <div
        class="searchPanel igraph-dockable igraph-draggable"
        igraph-control-role="SearchBoxCtrl"
        igraph-dock-position="A:10,20"
      >
        <div class="searchPanel1">
          <input
            class="igraph-searchbox"
            type="text"
            size="16"
            placeholder="input keyword"
          />
        </div>
        <div class="searchPanel2">
          <span align="center" class="fa fa-search fa-lg"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '/public/static/interactive-graph-0.1.0/interactive-graph.min.css'
  import '/public/static/jquery-3.2.1/jquery-3.2.1.min.js'
  import '/public/static/jquery-3.2.1/jquery-ui.css'
  import '/public/static/jquery-3.2.1/jquery-ui.js'
  import '/public/static/font-awesome-4.7.0/css/font-awesome.min.css'
  import igraph from '/public/static/interactive-graph-0.1.0/interactive-graph.min.js'

  export default {
    name: 'Explorer',
    components: {},
    props: {},
    data() {
      return {
        str: {
          categories: {
            person: '人物',
            organization: '机构',
            location: '地点',
          },
          data: {
            nodes: [
              {
                id: '1',
                label: 'bluejoe',
                value: 150,
                image: 'https://bluejoe2008.github.io/bluejoe3.png',
                categories: ['person'],
                info: 'demo1',
              },
              {
                id: '2',
                label: 'CNIC',
                value: 30,
                image: 'https://bluejoe2008.github.io/cas.jpg',
                categories: ['organization'],
                info: 'demo2',
              },
              {
                id: '3',
                label: 'beijing',
                value: 20,
                image: 'https://bluejoe2008.github.io/beijing.jpg',
                categories: ['location'],
                info: 'demo3',
              },
            ],
            edges: [
              { from: '1', to: '2', label: 'work for' },
              { from: '1', to: '3', label: 'live in' },
            ],
          },
          translator: {
            nodes: function (node) {
              console.log('here is the translator')
              //set description
              if (node.description === undefined) {
                var description = '<p align=left>'
                description += "<img src='" + node.image + "' width=350/><br>"
                description += '<b>' + node.label + '</b>' + '[' + node.id + ']'
                description += '</p>'
                node.description = description
              }
            },
          },
        },
      }
    },
    computed: {},
    watch: {
      // id(newVal, oldVal) {
      //   this.$nextTick(() => {
      //     console.log('gallery have been changed')
      //     if (this.mcstype === 'img') this.fetchImgMcs()
      //     if (this.mcstype === 'face') this.fetchFaceMcs()
      //   })
      // },
    },
    created() {},
    mounted() {
      igraph.i18n.setLanguage('chs')
      var app = new igraph.GraphExplorer(document.getElementById('graphArea'))
      app.loadGson(
        'http://www.deep-diary.com/api/faces/test/',
        {
          onGetNodeDescription: function (node) {
            console.log(node)
            var description = '<p align=center>'
            if (node.image !== undefined) {
              description += "<img src='" + node.image + "' width=200/><br>"
            }
            description += '<b>' + node.label + '</b>' + '[' + node.id + ']'
            description += '</p>'
            if (node.desc !== undefined) {
              description += '<p align=left>' + node.desc + '</p>'
            } else {
              if (node.title !== undefined)
                description += '<p align=left>' + node.title + '</p>'
            }

            return description
          },
        },
        function () {
          app.pickup([
            {
              label: 'blue',
            },
          ])
        }
      )
      // Not allowed to load local resource, but the http url, which si through get method

      // app.loadGson(
      //   'honglou2_narrow.json',
      //   {
      //     onGetNodeDescription: function (node) {
      //       console.log(node)
      //       var description = '<p align=center>'
      //       if (node.image !== undefined) {
      //         description += "<img src='" + node.image + "' width=150/><br>"
      //       }
      //       description += '<b>' + node.label + '</b>' + '[' + node.id + ']'
      //       description += '</p>'
      //       if (node.info !== undefined) {
      //         description += '<p align=left>' + node.info + '</p>'
      //       } else {
      //         if (node.title !== undefined)
      //           description += '<p align=left>' + node.title + '</p>'
      //       }

      //       return description
      //     },
      //   },
      //   function () {}
      // )
    },
    methods: {},
  }
</script>

<style lang="css" scoped>
  #graphArea {
    height: 1000px;
    border: 1px solid lightgray;
  }
</style>
