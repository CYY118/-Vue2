<template>
  <div>
    <el-tag effect="dark" class="my-tag">
      <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -3px;">
        <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
        <path
          d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z"
          fill="#FFAA44"></path>
        <path
          d="M68.266667 921.6a34.133333 34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z"
          fill="#11AA66"></path>
        <path
          d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z"
          fill="#FFFFFF"></path>
      </svg>
      菜单管理
    </el-tag>
    <div style="margin-bottom: 20px">
      <el-button type="primary" size="mini" @click="insertMenu">新增导航</el-button>
    </div>
    <el-table :data="menuList" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="title" label="菜单名称" align="center"></el-table-column>
      <el-table-column prop="isOutSide" label="是否外链" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isOutSide === false ? 'danger' : 'success'"
                  disable-transitions>
            {{scope.row.isOutSide === false ? '否' : '是'}}
          </el-tag>
          <el-switch @click.native="changeStatus(scope.row, 2)" v-model="scope.row.isOutSide"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="菜单路径" align="center"></el-table-column>
      <el-table-column prop="sequence" label="顺序" align="center"></el-table-column>
      <el-table-column prop="type" label="类别" align="center">
        <template slot-scope="scope">
          <span v-for="item in typeOptions" v-bind:key="item.value" >
            <span v-if="item.value===scope.row.type">
              {{item.label}}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="isEnable" label="是否启用" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnable === false ? 'danger' : 'success'"
                  disable-transitions>
            {{scope.row.isEnable === false ? '否' : '是'}}
          </el-tag>
          <el-switch @click.native="changeStatus(scope.row, 1)" v-model="scope.row.isEnable"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" style="color: var(--blue)" @click="updateMenu(scope.row)">
            编辑
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next"
                     :current-page="pagination.current"
                     :page-size="pagination.size"
                     :total="pagination.total">
      </el-pagination>

<!--      @current-change="handlePageChange"-->
    </div>
    <el-dialog :title="tit"
               :visible.sync="sortDialog"
               width="30%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               center>
      <div class="my-dialog">
        <el-form ref="form" :model="menuForm" :rules="formRules" label-width="120px">
          <el-form-item label="菜单名称" prop="title">
            <el-input v-model="menuForm.title" placeholder="请输入菜单名称" />
          </el-form-item>
          <el-form-item label="菜单路径" prop="path">
            <el-input v-model="menuForm.path" placeholder="请输入菜单路径" />
          </el-form-item>
          <el-form-item label="顺序" prop="sequence">
            <el-input-number v-model="menuForm.sequence" placeholder="请输入顺序序号" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="menuForm.type" placeholder="请选择类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否外链" prop="isOutSide">
            <el-tag :type="menuForm.isOutSide === false ? 'danger' : 'success'"
                    disable-transitions>
              {{menuForm.isOutSide === false ? '否' : '是'}}
            </el-tag>
            <el-switch v-model="menuForm.isOutSide"></el-switch>
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnable">
            <el-tag :type="menuForm.isEnable === false ? 'danger' : 'success'"
                    disable-transitions>
              {{menuForm.isEnable === false ? '否' : '是'}}
            </el-tag>
            <el-switch v-model="menuForm.isEnable"></el-switch>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "menu",
  data() {
    return {
      tit:"",
      dialogType:null,
      sortDialog: false,
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      menuForm:{
        title: '',
        path: '',
        sequence: null,
        type: 0,
        isOutSide: null,
        isEnable: null,
      },
      menuList: [],
      typeOptions:[
        {
          value: '0',
          label: 'admin'
        },
        {
          value: '1',
          label: '管理员'
        },
        {
          value: '2',
          label: '普通用户'
        }
      ],
      formRules:{
        title: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入菜单URL', trigger: 'blur' }
        ],
        sequence: [
          { required: true, message: '请输入菜单排序', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '请选择菜单状态', trigger: 'blur' }
        ],
        isOutSide: [
          { required: true, message: '请选择菜单是否外链状态', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getMenu()
  },
  computed: {
    switchValue() {
      return function(row) {
        return row=== 'true';
      };
    },
  },
  methods:{
    changeStatus(item, flag){
      let param={}
      if (flag===1){
        param={
          id: item.id,
          isEnable: item.isEnable?1:0,
        }
      }else if (flag===2){
        param={
          id: item.id,
          isOutSide: item.isOutSide?1:0,
        }
      }
      this.$http.post(this.$constant.baseURL + "/navigation/saveNavigation", param, true)
        .then((res) => {
          this.pagination.current = 1;
          this.getMenu();
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.reset()
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        }).finally(() => {

      })
    },
    handleSwitchChange(row) {
      console.log("switch change:", row);
      // 这里可以发送 API 请求，更新数据库中对应行的状态值
      this.menuForm.isEnable = row == true ? false : true; // 手动修改数据
      console.log("this.menuForm.isEnable:", this.menuForm.isEnable);
    },
    reset(){
      this.menuForm={
        title: '',
          path: '',
          sequence: null,
          type: "",
          isOutSide: null,
          isEnable: null,
      }
    },
    getMenu(){
      console.log("ceshicew测试：》》》》》")
      let url="/navigation/getNavigation"
      this.$http.get(this.$constant.baseURL + url, this.pagination, true)
        .then((res) => {
          console.log("ceshicew测试：》》》》》",res)
          if (!this.$common.isEmpty(res.data)) {
            this.menuList = res.data;
            this.pagination.total = res.data.total;
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    handleDelete(item) {
      this.$confirm('确认删除资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        this.$http.get(this.$constant.baseURL + "/navigation/deleteNavigation", {id: item.id}, true)
          .then((res) => {
            this.pagination.current = 1;
            this.getMenu();
            this.$message({
              message: "删除成功！",
              type: "success"
            });

          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });

          })
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '已取消删除!'
        });
      });
    },
    handleClose() {
      this.reset()
      this.sortDialog = false;
    },
    save(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$http.post(this.$constant.baseURL + "/navigation/saveNavigation", this.menuForm, true)
            .then((res) => {
              this.pagination.current = 1;
              this.getMenu();
              this.$message({
                message: "操作成功！",
                type: "success"
              });
              this.reset()
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            }).finally(() => {
            this.sortDialog = false;
          })
        }
      })
    },
    updateMenu(row) {
      this.tit='修改导航'
      this.sortDialog=true
      this.menuForm= row
      console.log(">>>>>>>",this.menuForm)
    },
    insertMenu() {
      this.tit='新增导航'
      this.sortDialog=true
    }
  }
}
</script>

<style scoped>

.my-tag {
  margin-bottom: 40px;
  width: 100%;
  text-align: left;
  background: var(--lightYellow);
  border: none;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: var(--black);
}

.pagination {
  margin: 20px 0;
  text-align: right;
}

.my-dialog > div {
  margin: 12px;
}

.my-dialog >>> input::-webkit-inner-spin-button {
  appearance: none;
}
</style>
