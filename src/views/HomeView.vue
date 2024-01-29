<template>
  <div class="home">
    <template-page url="/http/url" :form="form">

    </template-page>
  </div>
</template>

<script>
// @ is an alias to /src
import TemplatePage from "@/components/template-page/index.js";

export default {
  name: "HomeView",
  components: {
    TemplatePage,
  },
  data() {
    return{
      form: [{
        type: 'input',
        key: 'search',
        label: '搜索',
        value: '哈哈',
        placeholder: '请输入搜索内容',
        disabled: false
      }]
    }
  }
};
</script>

<style>
.home{
  padding: 20px;
  height: 100%;
}
</style>