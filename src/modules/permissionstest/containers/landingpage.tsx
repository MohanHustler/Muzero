import React,{FunctionComponent,useState} from "react"
import {
    Button,
    Select ,
    Grid ,
    MenuItem

} from "@material-ui/core"
import {addAbility} from "../helper/api"
import CAN from "../../common/api/casl/can"
import {updateAbilities} from "../helper/api"
interface Props {

}

const LandingPage : FunctionComponent<Props> = ({}) => {
    const [currentAction,setCurrentAction]  = useState<string>("")
    const [currentSubject,setCurrentSubject] = useState<string>("")
    updateAbilities()
    return (
        <div>
            <Grid container>
                <Grid item lg={4} md={4} >
                    <Select
                    value={currentAction}
                    label="Action"
                    onChange = {(ev)=>{
                        const val = ev.target.value as string
                        setCurrentAction(val)
                    }}
                    >
                        <MenuItem value="">Select Option</MenuItem>
                        <MenuItem value="View">View</MenuItem>
                        <MenuItem value="Click">Click</MenuItem>
                    </Select>
                </Grid>
                <Grid item lg={4} md={4} >
                    <Select
                    label="Subject"
                    value={currentSubject}
                    onChange = {(ev)=>{
                        const val = ev.target.value as string
                        setCurrentSubject(val)
                    }}
                    >
                        <MenuItem value="">Select Option</MenuItem>
                        <MenuItem value="Text">Text</MenuItem>
                        <MenuItem value="Button">Button</MenuItem>
                    </Select>
                </Grid>
                <Grid item lg={4} md={4}>
                    <Button onClick ={(ev)=>{
                        addAbility( "This Page",[{
                            action:currentAction,
                            subject:currentSubject,
                        }],["6008106ee722202384178854"])
                    }}>
                        Add
                    </Button>
                </Grid>

            </Grid>
            
            
        </div>
    )
}


export default LandingPage
