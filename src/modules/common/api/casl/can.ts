import { Ability, AbilityBuilder ,subject } from "@casl/ability";
import { store } from "../../../../store";
import {permissions, User, RawRule} from "../../contracts/user"
import { RootState } from '../../../../store'
const ability = new Ability();
export default (action:string, subjectBase:string, conditions?: any  , fields? :any ) => {
    console.log(conditions)
    if(conditions===undefined){
        return ability.can(action,subjectBase,fields)
    }
    else{
        const doc = subject(subjectBase,conditions)
    return ability.can(action, doc ,fields);
    }
    
    
};

let authPermissions
store.subscribe(() => {
    authPermissions= store.getState().authReducer.authUserPermissions;
    ability.update(defineRulesFor(authPermissions as permissions));
});
  

const defineRulesFor = (authPermissions:permissions) => {
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    

    authPermissions.accesspermissions.forEach((permissionSet)=>{
        permissionSet.abilityJSON.forEach((perRawRule)=>{
            if(perRawRule.inverted){
                cannot(perRawRule.action,perRawRule.subject,perRawRule.conditions).because(perRawRule.reason as string)
            }
            else{
                can(perRawRule.action,perRawRule.subject,perRawRule.conditions)
            }
        })
    })
  
    return rules;
  };

