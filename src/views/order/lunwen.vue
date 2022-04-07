<template>
    <div  class="order-content">
        <el-form :model="orderForm" :rules="rules" label-width="80px" label-position="top" ref="lunwenform"   class="demo-orderForm" >
            <el-form-item label="选择毕业论文辅导阶段" class="important">
                <el-checkbox v-model="checkAll" @change="handleCheckAllstage">全选</el-checkbox>
                <el-checkbox-group v-model="stageNameList" >
                    <el-checkbox v-for="(item,index) in stateList" :key="item.stageType"  @change="stageEntityChange(index,stageNameList,$event)" :label="item">
                        {{item.stageName}}
                    </el-checkbox> 
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <div class="stageBar">
                    <span style="margin-left:4px">阶段顺序</span>
                    <span >课程阶段</span>
                    <span >包含课程</span>
                    <span style="width:300px">学生阶段材料 </span>
                </div>
                <draggable :move="dragfilter" v-model="orderForm.stageEntity">
                    <div class="stageList" v-for="(item,index) in orderForm.stageEntity" :key="item.stageType">
                        <div style="margin-left:4px">
                            阶段{{index + 1}}
                        </div>
                        <div >
                            {{item.stageName}}
                        </div>
                        <div style="display: flex;flex-direction: column;">
                            <div v-for="(items,indexs) in item.stageClass" :key="indexs">{{items.className}}、</div>
                        </div>
                        <div style="width:300px">
                            <button class="upload-btn"  v-if="item.studStageFile.length"  @click="showfileList($event,index)">查看</button>
                            <uploadfile :urlarr.sync="item.studStageFile"  :id="item.stageType" />
                        </div>
                    </div>
                </draggable>
            </el-form-item>
        </el-form>
        <el-dialog
            title="上传的文件"
            :visible.sync="fliedialogVisible"
            width="40%"
            center>
            <ul v-if="fileArr.length" class="showfile-list">
                <li v-for="(file,index) in fileArr" :key="index" @click="openurl(file.url)">{{file.name}}</li>
            </ul>
            <span v-else>暂无文件</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="fliedialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="fliedialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import uploadfile from './conponment/uploadfile'
    import { queryConfig } from "@/api/order";
    import { SysCode } from "@/utils/Enum/Customer/Account";
    import { mapState } from "vuex";
    import draggable from 'vuedraggable'
    export default {
        props:['orderForm'],
        data() {
            return {
                checkAll: false,
                stateList: [],
                stageNameList:[],
                rules: {},
                fileArr:[],
                fliedialogVisible:false,
            }
        },
        created() {
            console.log(this.stageliststroge,'stageliststroge')
            
            this.getstageConfig()
        },
        components: {
            //调用组件
            draggable,
            uploadfile
        },
        computed: {
            ...mapState({
                stageliststroge: (e) => e.order_user.stagelist,
            }),
        },
        methods: {
            //TODO 全选
            handleCheckAllstage(e) {
                this.orderForm.stageEntity = e ? this.stateList : [];
                this.stageNameList = e ? this.stateList : [];
            },
            dragfilter(e) {
                if (e.draggedContext.element.stageType == 7 || e.relatedContext.element.stageType == 7) {
                    return false;
                }
            },
            showfileList(event,index){
                console.log(event,index);
                event.preventDefault();
                const list = this.orderForm.stageEntity[index];
                this.fileArr = []
                if(list.studStageFile && list.studStageFile.length){
                    const file = list.studStageFile;
                    this.fileArr = file;
                }
                
                this.fliedialogVisible = true;
            },
            openurl(url){
                window.open(url, '_blank','width:800,height:600');
            },
            async getstageConfig() {
                const sysCode = SysCode.DAOBI;
                const {status,body} = await queryConfig({sysCode});
                if(status == 200){
                    let arr = body;
                    arr.forEach(item=>{
                        item.studStageFile = [];
                    })
                    this.stateList = arr;
                }
                // this.stageNameList = this.stageliststroge;
                console.log( this.stageNameList,'990099')
            },
            stageEntityChange(index, data, bool) {
                // console.log(index, '下标')
                // console.log(data, '阶段数据')
                // console.log('是否发生改变', bool)
                // this.getstageConfig();
                // let stagePool = [];
                data.map(
                    item => {
                        // console.log(item,'单个信息')
                        if(bool){
                            this.orderForm.stageEntity.push(item)
                        }else{

                        }
                    }
                )
                let stageQuanwen = '';
                data.map(
                    (item, index) => {
                        if (item.stageType == 7) {
                            stageQuanwen = item;
                            data.splice(index, 1);

                        }
                    }
                )
                if (stageQuanwen != '') {
                    data.push(stageQuanwen)
                }

                this.orderForm.stageEntity = data;
                this.checkAll = 7 === data.length;
            },
            formjudge(){
                let status = false;
                this.$refs.lunwenform.validate((valid) => {
                    if (valid) {
                        status = true;
                    }
                });
                return status;
            },
            fileStroge(){
                this.$store.dispatch('setStagelist',this.stageNameList)
            },

        }
    }
</script>

<style lang="scss" scoped>
.showfile-list{
    li{
        line-height: 30px;
        border:1px solid #ccc;
        margin-bottom:10px;
        text-indent: 10px;
        &:hover{
            border-color: rgba(73,121,255,1);
        }
    }
}
.upload-btn{
   width:64px;
   height:24px;
   font-size:14px;
   border-radius:2px;
   color: rgba(73,121,255,1);
   background: #fff;
   border:1px solid rgba(73,121,255,1);
}
.order-content{
    background: #fff;
}
.stageBar{
    line-height: 40px;
    background: #f5f5f5;
}   
.stageBar,.stageList{
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
}
.stageBar span,
.stageList>div{
    flex: 1;
}
.stageList:nth-of-type(2n){
   background: #f5f5f5;
}
</style>
