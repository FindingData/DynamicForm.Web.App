

export default {
    state:{
        win_content:{
            width:'',
            height:''
        },
        leftMenuSlider:true
    },
    mutations:{
        SET_WIN_CONTENT:(state,obj)=>{
            state.win_content.width=obj.width
            state.win_content.height=obj.height
        },
        SET_LEFT_MEN_SLIDER:(state,flag)=>{
            state.leftMenuSlider=flag
        },
    },
    getters:{
        width:state=>state.win_content.width,
        height:state=>state.win_content.height,
        leftMenuSlider:state=>state.leftMenuSlider
    },
    actions:{
        set_win_content:({commit},obj)=>{
            commit('SET_WIN_CONTENT',obj)
        }
    }
}