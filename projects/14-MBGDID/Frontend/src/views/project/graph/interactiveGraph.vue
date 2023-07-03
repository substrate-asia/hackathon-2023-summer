<template>
  <div class="interactiveGraph-container">
    <!-- <h2>interactiveGraph</h2> -->
    <div style="height: 100%">
      <div id="graphArea"></div>
    </div>
  </div>
</template>

<script>
  import '/public/lib/interactive-graph-0.1.0/interactive-graph.min.css'
  import '/public/lib/jquery-3.2.1/jquery-3.2.1.min.js'
  import '/public/lib/jquery-3.2.1/jquery-ui.css'
  import '/public/lib/jquery-3.2.1/jquery-ui.js'
  import '/public/lib/font-awesome-4.7.0/css/font-awesome.min.css'
  import igraph from '/public/lib/interactive-graph-0.1.0/interactive-graph.min.js'

  export default {
    name: 'Graph',
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
      var app = new igraph.GraphNavigator(
        document.getElementById('graphArea'),
        'LIGHT'
      )

      // app.connectService(
      //   igraph.LocalGraph.fromGsonString(JSON.stringify(this.str))
      // )
      app.loadGson(
        'http://localhost:8000/api/faces/test/',
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
        function () {}
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
