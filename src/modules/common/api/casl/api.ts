import {ADD_ABILITY,GET_ABILITIES,PATCH_ABILITY} from "./routes"
import axios from "axios"
import {RawRule} from "../../contracts/user"
import {permissions} from "../../contracts/user"
import {setAuthUserPermissions} from "../../../auth/store/actions"

interface getAbilitiesResponse  {
    abilityDocs:permissions
}

export const addAbility = async (pageId:string,abilityJSON:RawRule[] , consumerId : string[]) =>{
    try {
        const response = await axios.post(ADD_ABILITY,{pageId,abilityJSON,consumerId})
        console.log(response)
    }
    catch(err) {
        console.log(err)
    }
}

export const updateAbilities = async () =>{
    try {
        const response = await axios.get<getAbilitiesResponse>(GET_ABILITIES)
        const permissonsObject = response.data.abilityDocs
        setAuthUserPermissions(permissonsObject)
    }
    catch(err) {
        console.log(err)
    }
}