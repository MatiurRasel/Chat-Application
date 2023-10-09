import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Member } from "../_models/member";
import { MembersService } from "../_services/members.service";


export const memberDetailedResolver: ResolveFn<Member> = (route, state) => {
    return inject(MembersService).getMember(route.paramMap.get('userName')!);
};




