<template>
  <v-app>
    <v-container fluid>
      <v-layout align-start justify-center>
        <v-form>
          <v-card align-center justify-center max-width="600">
            <v-toolbar color="indigo" dark>
              <v-app-bar-nav-icon></v-app-bar-nav-icon>
              <v-toolbar-title>Training</v-toolbar-title>
            </v-toolbar>

            <v-divider></v-divider>

            <v-row class="align-baseline" justify="center">
              <v-list v-for="(elem, idx) in expressionObj" :key="idx">
                <v-list-item v-if="elem.type ==='unknown'">
                  <v-text-field :id="`num${idx}`"  type="number" autofocus validate-on-blur
                                @focus="rememberInputFocus($event)"
                                v-model="elem.val" ></v-text-field>
                </v-list-item>
                <v-list-item v-else>
                  <span>{{ elem.val }}</span>
                </v-list-item>
              </v-list>
            </v-row>

            <v-divider></v-divider>

            <v-row class="pa-6" justify="center">
              <v-col :key="idx" cols="3" v-for="(n, idx) in buttons">
                <v-row align="center" class="fill-height" justify="center">
                  <v-btn v-if="n > ' '"
                         :color="(idx + 1) % 4 === 0 ? 'grey' : 'green lighten-1'"
                         @click.native="clickBtnFigure(n)"
                         fab dark >
                    {{ n }}
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-layout justify="center" pa-2 row>
              <v-flex pa-2>
                <v-progress-linear :value="progress" color="lighten-2 indigo"></v-progress-linear>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>

            <v-card-actions>
              <v-layout align-baseline justify-space-between ml-2 mr-2 row color="purple">
                <v-card flat color="purple--text">
                  {{timeLeft }}
                </v-card>
                <v-card flat >
                  <v-btn color="indigo" outlined tile to="/settings">
                    <v-icon left>mdi-exit-run</v-icon>
                    Exit
                  </v-btn>
                </v-card>
              </v-layout>
            </v-card-actions>

          </v-card>
        </v-form>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
  import moment from "moment";
  export default {
    name: "PageTraining",
    data: () => ({
      expressionObj: [
        {val: '13', type: 'number'},
        {val: '*', type: 'operator'},
        {val: '(', type: 'operator'},
        {val: '', type: 'unknown'},
        {val: '+', type: 'operator'},
        {val: '', type: 'unknown'},
        {val: ')', type: 'operator'},
        {val: '=', type: 'operator'},
        {val: '84240', type: 'number'},
      ],
      progress: 80,
      date: moment(60 * 10 * 1000),
      lastFocusedInput: null,
      interval: null
    }),
    methods: {
      rememberInputFocus: function (event) {
        this.lastFocusedInput = event.target;
      },
      clickBtnFigure: function (figure) {
        if (!isNaN(figure)) {
          let idxFocusedInput = +this.lastFocusedInput.id.replace('num', '')
          let newInputValue = this.expressionObj[idxFocusedInput].val + figure;
          this.expressionObj[idxFocusedInput].val = newInputValue;
        }
      }
    },
    computed: {
      buttons: () => "123<456>789? 0 =".split(""),
      timeLeft: function () {
        return this.date.format("mm:ss");
      }
    },
    mounted() {
      this.interval = setInterval(() => {
        this.date = moment(this.date.subtract(1, "seconds"));
      }, 1000);
    },
    beforeDestroy() {
      clearInterval(this.interval);
    }
  };
</script>

<style scoped>
  .v-text-field {
    width: 70px;
  }
</style>