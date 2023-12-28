<template>
    <div class="container" :class="{'mode-editor': editMode}">
        <div class="bg-box" v-if="bgSrc">
            <img class="image-bg" :src="bgSrc">
            <div class="filter-box"></div>
        </div>

        <div class="msg-box">
            <el-alert v-if="editMode" title="您处于编辑模式" show-icon type="warning" effect="dark" @close="editMode = false"></el-alert>
        </div>

        <drawer :open.sync="isDrawerShow"></drawer>
        
        <component :is="editMode? 'draggable' : 'div'" v-model="categorys" class="main-content" :handle="'.drag-box'" @end="dragEnd">
            <div class="link-wrap" v-for="item in categorys" :key="item.categoryId">
                <div v-if="editMode" class="drag-box">
                    <i class="iconfont icon-dragable"></i>
                </div>
                <i class="el-icon-remove" @click="delCategory(item.categoryId)"></i>
                <div v-if="editMode" class="edit-box">
                    <el-input v-model="item.name" size="mini" :disabled="!item.isEdit">
                        <template slot="append">
                            <i v-if="item.isEdit" class="el-icon-check" @click="updateCategoryName(item.categoryId, item.name)"></i>
                            <i v-else class="el-icon-edit" @click="editInput(item.categoryId)"></i>
                        </template>
                    </el-input>
                </div>
                <div v-else class="title">{{item.name}}</div>
                <div class="link-item">
                    <div class="link-box" v-for="o in item.links" :key="o._id" @click="linkto(o.link)">
                        <div class="box">{{ o.name }}</div>
                        <div v-if="editMode" class="delete-box" @click.stop="deleteLink(o.categoryId)">
                            <i class="el-icon-close"></i>
                        </div>
                    </div>
                    <div v-if="editMode" class="link-box" @click.stop="addLink(item.categoryId)">
                        <div class="box btn-add"><i class="el-icon-plus"></i></div>
                    </div>
                </div>
            </div>
            <div v-if="editMode" class="link-wrap add" @click="addCategoryFrame" style="user-drag: none;">
                <i class="el-icon-plus"></i>
            </div>
            <div v-else-if="startEleShow" class="start-box" @click="editMode = true">
                <i class="el-icon-plus"></i>
            </div>
        </component>
        
       <div class="tools-box">
            <i class="icon el-icon-menu" :style="{'color': editMode? '#f56c6c' : ''}" @click="editMode = !editMode"></i>
            <i class="icon el-icon-setting" :style="{'color': isDrawerShow? '#f56c6c' : ''}" @click="showPanel" title="设置"></i>
       </div>

       <!-- 新增链接弹窗 -->
       <el-dialog title="新增链接" :visible.sync="dialogVisible" width="380px" top="20vh">
            <el-form size="small">
                <el-form-item>
                    <el-input v-model="linkForm.name" placeholder="名称" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input class="prefix-box" placeholder="地址" v-model="linkForm.link" clearable>
                    <el-select v-model="linkForm.protocol" slot="prepend" placeholder="协议">
                        <el-option label="https://" value="1"></el-option>
                        <el-option label="http://" value="2"></el-option>
                    </el-select>
                </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addLinkConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import { addLink, delLink} from '@/api/link'
    import { addCategory, getCategory, delCategory, sortCategory, updateCategoryName } from '@/api/category'
    import draggable from 'vuedraggable'
    import drawer from '@/components/drawer'
    import constants from '@/constants'
    export default {
        components: {
            drawer,
            draggable
        },
        computed:{
            bgSrc(){
                let bgPath = this.$store.state.user.bgPath
                if(!bgPath || bgPath == 'undefined'){
                    return ''
                }else{
                    return constants.baseUrl + bgPath
                }
            },
            linkOpenWay(){
                return this.$store.state.user.linkOpenWay
            }
        },
        data(){
            return {
                linkForm:{
                    name: '',
                    link: '',
                    protocol: 'https://'
                },
                categorys: [],
                editMode: false,
                dialogVisible: false,
                curCategoryId: '',
                isDrawerShow: false,
                startEleShow: false
            }
        },
        created(){
            this.getCategory()
        },
        methods:{
            getCategory(){
                getCategory().then(res=>{
                    this.categorys = res.data
                    this.startEleShow = !this.categorys.length
                })
            },
            addLink(categoryId){
                this.curCategoryId = categoryId
                this.dialogVisible = true
            },
            editInput(categoryId){
                let index = this.categorys.findIndex(v=>v.categoryId == categoryId)
                this.$set(this.categorys[index], 'isEdit', true)
            },
            updateCategoryName(categoryId, name){
                let index = this.categorys.findIndex(v=>v.categoryId == categoryId)
                this.$set(this.categorys[index], 'isEdit', false)
                updateCategoryName({categoryId, name}).then(res=>{
                    this.$notify({
                        title: '成功',
                        message: '分类名称已保存',
                        position: 'bottom-right',
                        type: 'success'
                    });
                })
            },
            deleteLink(categoryId){
                delLink(categoryId).then(res=>{
                    this.getCategory()
                })
            },
            dragEnd(){
                let ids = this.categorys.map(v=>v.categoryId)
                sortCategory(ids).then(res=>{
                    this.getCategory()
                })
            },
            delCategory(categoryId){
                this.$confirm('此操作将一并删除该分类下的链接, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delCategory(categoryId).then(res=>{
                        this.getCategory()
                    })
                })
                .catch(err=>{

                })
            },
            linkto(url){
                let way = this.linkOpenWay? '_blank': '_self'
                window.open(url, way)
            },
            addCategoryFrame(){
                addCategory().then(res=>{
                    this.getCategory()
                })
            },
            addLinkConfirm(){
                if(!this.linkForm.name || !this.linkForm.link){
                    alert('请输入名称或链接地址')
                }
                const link = `${this.linkForm.protocol}${this.linkForm.link}`
                addLink({name: this.linkForm.name, link, categoryId: this.curCategoryId}).then(res=>{
                    this.linkForm.name = ''
                    this.linkForm.link = ''
                    this.dialogVisible = false
                    this.getCategory()
                })
            },
            showPanel(){
                this.isDrawerShow = true
            }
        }
    }
</script>
<style lang="scss" scoped>
    .mode-editor{
        .link-wrap{
            border: 1px dashed #ccc;
            .el-icon-remove{
                display: block;
            }
        }
        .link-box{
            .box:not(.btn-add){
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
        }
    }
    .bg-box{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .filter-box{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(20px);
        }
        .image-bg{
            width: 100%;
            height: 100%;
            pointer-events:none;
        }
    }
    .start-box{
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 150px;
        height: 150px;
        border-radius: 12px;
        border: 1px solid #fff;
        transform: translate(-50%, -50%);
        color: #fff;
        .el-icon-plus{
            font-size: 60px;
        }
    }
    .prefix-box{
        /deep/ .el-input-group__prepend{
            width: 50px;
        }
    }
    .tag-box{
        display: flex;
        flex-wrap: wrap;
        .tag{
            width: 90px;
            margin: 0 10px;
            margin-bottom: 10px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .tools-box{
        position: fixed;
        left: 12px;
        bottom: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 40px;
        padding: 20px 0;
        border-radius: 30px;
        background-color: #fff;
        .icon{
            font-size: 30px;
            margin-bottom: 8px;
            color: #606266;
            &:last-child{
                margin-bottom: 0;
            }
        }
        .el-icon-menu{
            color: #606266;
        }
    }
    .msg-box{
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 100;
    }
    .main-content{
        display: flex;
        flex-wrap: wrap;
        padding: 0 40px;
    }
    .link-wrap{
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 10px 50px;
        padding: 40px 20px 20px;
        width: 232px;
        min-height: 180px;
        box-sizing: border-box;
        &.add{
           position: relative;
            .el-icon-plus{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 40px;
                color: #fff;
            }
        }
        .drag-box{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            line-height: 28px;
            padding-left: 5px;
            background-color: rgba(0,0,0,.1);
            color: #fff;
            text-align: left;
            z-index: 2;
            user-select: none;
            box-sizing: border-box;
            cursor: grab;
            .icon-dragable{
                font-size: 20px;
            }
        }
        .edit-box{
            width: 120px;
            /deep/ .el-input-group__append{
                padding: 0 8px;
                background-color: #f56c6c;
                color: #fff;
                border: none;
            }
        }
        .el-icon-remove{
            display: none;
            position: absolute;
            top: -12px;
            right: -12px;
            font-size: 24px;
            color: #f56c6c;
            background-color: #fff;
            border-radius: 100%;
            z-index: 3;
        }
        .title{
            margin-bottom: 10px;
            font-size: 24px;
            color: #fff;
        }
    }
    .link-box{
        display: flex;
        align-items: center;
        line-height: 36px;
        margin: 10px 20px;
        text-align: center;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        color: #000;
        .box{
            width: 120px;
            padding: 0 8px;
            box-sizing: border-box;
            background-color: #ebeef5;
            color: #303133;
            border-radius: 2px;
        }
        .delete-box{
            width: 30px;
            right: 0;
            top: 0;
            background-color: #f56c6c;
            color: #fff;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
        }
        &:hover{
           .text{
                background-color: #f2f6fc;
                transition: all .2s;
           }
        }
    }
    .container{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-height: 100vh;
        background: linear-gradient(-135deg, #506f8f, #9b2f2f);
        background-repeat: no-repeat;
        background-size: cover;
        box-sizing: border-box;
        user-select: none;
        padding: 50px 0;
        cursor: default;
        overflow-x: hidden;
    }
</style>