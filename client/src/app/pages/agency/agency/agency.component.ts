import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Agency } from 'src/app/models/agency';
import { Invitation } from 'src/app/models/invitation';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { AgencyService } from 'src/app/services/agency.service';
import { InvitationService } from 'src/app/services/invitation.service';
import { MailerService } from 'src/app/services/mailer.service';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent implements OnInit {

  user: User = new User()
  userRole: Role = new Role()
  agency: Agency = new Agency()

  pending: Invitation[] = []
  agentList: any[] = []
  filteredAgentList: any[] = []
  agencyPermissions: Role[] = []
  roles: any = {}
  adminCount: number = 0
  adminRole: string = ''

  invitation: Invitation = new Invitation()
  newRole: Role = new Role()
  today = new Date()

  selectedInvitation: Invitation = new Invitation()
  selectedAgent: User = new User()
  selectedRole: Role = new Role()

  editName: boolean = false
  newRoleError: boolean = false

  building: boolean = false
  loading: boolean = true
  sendingInvitation: boolean = false
  savingRoles: boolean = false
  updatingAgent: boolean = false
  
  @ViewChild('closeNewAgency', {static: false}) closeNewAgency: ElementRef
  @ViewChild('closeSendInvitation', {static: false}) closeSendInvitation: ElementRef
  @ViewChild('closeRoles', {static: false}) closeRoles: ElementRef
  @ViewChild('openEditUserRole', {static: false}) openEditUserRole: ElementRef
  @ViewChild('closeEditUserRole', {static: false}) closeEditUserRole: ElementRef

  openConfirmCancel: ElementRef
  openConfirmRemove: ElementRef
  openConfirmDeleteRole: ElementRef

  constructor(private users: UserService,
              private agencies: AgencyService,
              private snackbar: MatSnackBar,
              private permissions: RolesService,
              private invitations: InvitationService,
              private mailer: MailerService) { }

  ngOnInit() {
    this.users.user.subscribe(res => {
      this.user = res
    })
    this.permissions.user().subscribe((res: any) => {
      if(res != 'not found' && res != 'invalid') this.userRole = res
    })
    this.agencies.user().subscribe((res: any) => {
      if(res != 'invalid') {
        this.invitations.agency(res.agency._id).subscribe((res: []) => {
          this.pending = res
        })
        this.agency = res.agency
        this.agentList = res.agents.map(user => {
          const expiration = new Date(user.pro_expiration)
          user.pro = expiration > this.today
          user.string = user.name.toLowerCase() + user.email.toLowerCase() + user.phone
          return user
        })
        this.filteredAgentList = this.agentList
        this.pending = res.pending
        this.agencyPermissions = res.roles
        res.roles.forEach(role => {
          this.roles[role._id] = role.name
        })
        const admin = this.agencyPermissions.find(role => role.name == 'Admin')
        if(admin) this.adminRole = admin._id
        this.updateAdminCount()
      }
      this.loading = false
    })
  }

  updateAdminCount() {
    this.adminCount = 0
    this.agentList.forEach(agent => {
      if(agent.permissions_id == this.adminRole) this.adminCount++
    })
  }

  createAgency() {
    this.building = true
    this.agencies.create(this.agency).subscribe(res => {
      this.building = false
      if(res == 'success') location.reload()
    })
  }

  saveName() {
    this.loading = true
    this.agencies.update({name: this.agency.name, _id: this.agency._id}).subscribe(res => {
      this.snackbar.open('Nombre actualizado', '', {duration: 4000})
      this.loading = false
      this.editName = false
    })
  }

  saveLogo(url) {
    this.agency.logo_url = url
    this.loading = true
    this.agencies.update({logo_url: url, _id: this.agency._id}).subscribe(res => {
      this.snackbar.open('Logo actualizado', '', {duration: 4000})
      this.loading = false
    })
  }

  filter(e) {
    const str = e.target.value.toLowerCase()
    this.filteredAgentList = this.agentList.filter(a => a.string.includes(str))
  }

  sendInvitation() {
    if(this.invitation.permissions_id == 'null') return
    this.sendingInvitation = true
    this.invitation.agency_id = this.agency._id
    this.invitation.sender = this.user.name
    this.mailer.invite(this.invitation).subscribe((res: any) => {
      this.sendingInvitation = false
      this.closeSendInvitation.nativeElement.click()
      this.invitation = new Invitation()
      if(res.message == 'message sent') {
        if(!this.pending.find(i => i.email == res.invitation.email)) this.pending.unshift(res.invitation)
        this.snackbar.open('Invitación enviada', '', {duration: 4000})
      } else if(res.message == 'member') {
        this.snackbar.open('Ya existe un agente con ese correo', '', {duration: 4000})
      }
    })
  }

  cancelInvitation(invitation) {
    this.selectedInvitation = invitation
    this.openConfirmCancel.nativeElement.click()
  }

  handleCancel(confirm) {
    if(confirm) {
      this.loading = true
      this.invitations.delete(this.selectedInvitation._id).subscribe(res => {
        this.loading = false
        if(res == 'success') {
          this.pending = this.pending.filter(i => i._id != this.selectedInvitation._id)
          this.selectedInvitation = new Invitation()
          this.snackbar.open('Invitación cancelada', '', {duration: 4000})
        }
      })
    }
  }

  deleteAgent(agent) {
    this.selectedAgent = agent
    this.openConfirmRemove.nativeElement.click()
  }

  handleRemove(confirm) {
    if(confirm) {
      this.loading = true
      this.users.removeFromAgency(this.selectedAgent._id).subscribe((res: any) => {
        this.loading = false
        if(res == 'success') {
          this.agentList = this.agentList.filter(agent => agent._id != this.selectedAgent._id)
          this.filteredAgentList = this.agentList
          this.selectedAgent = new User()
        } else if(res == 'invalid') {
          this.snackbar.open('Debe existir al menos un Admin', '', {duration: 4000})
        }
      })
    }
  }

  createRole() {
    if(this.agencyPermissions.find(role => role.name == this.newRole.name)) {
      this.newRoleError = true
      return
    }
    this.newRole.agency_id = this.agency._id
    this.permissions.create(this.newRole).subscribe((res: any) => {
      if(res != 'invalid') {
        this.agencyPermissions.push(res)
        this.roles[res._id] = res.name
      }
      this.newRole = new Role()
    })
  }

  saveRoles() {
    this.savingRoles = true
    this.permissions.update(this.agencyPermissions).subscribe((res: any) => {
      this.savingRoles = false
      this.closeRoles.nativeElement.click()
      if(res == 'success') this.snackbar.open('Permisos actualizados', '', {duration: 4000})
    })
  }

  deleteRole(role) {
    this.selectedRole = role
    this.openConfirmDeleteRole.nativeElement.click()
  }

  handleDeleteRole(confirm) {
    if(confirm) {
      this.permissions.delete(this.selectedRole._id).subscribe((res: any) => {
        if(res != 'invalid') {
          this.agencyPermissions = this.agencyPermissions.filter(role => role._id != res._id)
          delete this.roles[res._id]
        }
        this.selectedRole = new Role()
      })
    }
  }

  editUserRole(user) {
    this.selectedAgent = user
    this.openEditUserRole.nativeElement.click()
  }

  updateAgent() {
    if(this.selectedAgent.permissions_id == 'null' ||
    (this.selectedAgent.permissions_id == this.adminRole && this.adminCount == 1)) return
    this.updatingAgent = true
    this.users.update(this.selectedAgent).subscribe((res: any) => {
      this.agentList = this.agentList.map(agent => agent._id != res._id ? agent : res)
      this.filteredAgentList = this.agentList
      this.updateAdminCount()
      this.updatingAgent = false
      this.closeEditUserRole.nativeElement.click()
    })
  }

}
