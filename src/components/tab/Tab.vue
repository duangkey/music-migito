<template>
    <div id="tab">
        <Row>
            <router-link to="Recommend" tag="div" class="tab-item">
                <i-col span="6" class="tab-link">推荐</i-col>
            </router-link>
            <router-link to="Singer" tag="div" class="tab-item">
                <i-col span="6" class="tab-link">歌手</i-col>
            </router-link>
            <router-link to="Rank" tag="div" class="tab-item">
                <i-col span="6" class="tab-link">排行</i-col>
            </router-link>
            <router-link to="Search" tag="div" class="tab-item">
                <i-col span="6" class="tab-link">搜索</i-col>
            </router-link>
        </Row>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
@import '~@/common/scss/const.scss';

#tab {
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;
  .tab-item {
    text-align: center;
    .tab-link {
      padding-bottom: 5px;
      color: $color-text-l;
    }
    &.router-link-active {
      .tab-link {
        color: $color-theme;
        &:after{
          content: '';
          width: 32px;
          display: block;
          height: 2px;
          background-color: $color-theme;
          margin: -2px auto 0px;
        }
      }
    }
  }
}
</style>
