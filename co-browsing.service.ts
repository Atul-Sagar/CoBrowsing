import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { isEqual } from 'lodash';
import { Location } from '@angular/common';
// const socketIO = require('socket.io');
// const IO = socketIO(server);


@Injectable({
  providedIn: 'root'
})
export class CoBrowsingService {

  public message$ : BehaviorSubject<string> = new BehaviorSubject('')
  previousResponse: any;
  contextData : any

  constructor(
    private location : Location
  ) { }

  nodeURL = 'http://192.168.156.112:3000'

  // socket = io('http://192.168.244.112:3000')
  // socket = io('http://192.168.233.112:3000')
  socket = io(this.nodeURL)
  // socket = io('http://192.168.136.112:3000')

  public sendMessageService(message : any){
    this.SendRoomMessage(this.ROOMID, message)
    // this.socket.emit('message', this.ROOMID, message)
    // this.socket.emit('message', message)
  }

  public testFunction(){
    console.log("This is a test function");
    alert("This is a test function")
  }

  public newMessage(message : any){
    this.socket.emit('message', message)
  }

  public getIP = () => {
    this.socket.on('YourIP', (IP) =>{
      sessionStorage.setItem("YOURIP", IP)
      alert("IP : " + IP)
    });
  }


  compareObjects(obj1 : any, obj2 : any) {
    const areEqual = isEqual(obj1, obj2);
    return areEqual
  }

  public getNewMessage = (context : any) =>{
    this.socket.on('message', (message) =>{
      this.handleResponse(message, context)
      this.message$.next(message);
    })

    return this.message$.asObservable();
  }

  async getLocalIPAddress(): Promise<string> {
    try {
      const rtcPeerConnection = new RTCPeerConnection({ iceServers: [] });
      const offer = await rtcPeerConnection.createOffer();
      const localDescription = rtcPeerConnection.localDescription as RTCSessionDescription;
      const ipAddressRegex = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/;
      const ipAddress = ipAddressRegex.exec(localDescription.sdp)?.[0] || '';
      rtcPeerConnection.close();
  
      return ipAddress;
    } catch (error) {
      console.error('Error retrieving local IP address:', error);
      return '';
    }
  }

  public handleScroll(){
    let top = window.pageYOffset || document.documentElement.scrollTop;
    let left = window.pageXOffset || document.documentElement.scrollLeft;

    console.log("Top : ", top);
    console.log("Left : ", left);

    let jsonObject = {
      action : 'scroll', clientX : left, clientY : top
    }

    // this.sendMessage(jsonObject)
    this.SendRoomMessage(this.ROOMID,jsonObject)
  }


  public accordionClick(){
    // .accordionTab

    let accordianTabs  = document.getElementsByClassName('accordionTab');
    let noOfTabs = accordianTabs.length;

    for (let index = 0; index < accordianTabs.length; index++) {
      const element : any = accordianTabs[index];
      console.log("Clicking Accordion Tab : " + index);
      
      element.click();
      // this.setListeners();
      
    }


  }

  public handleAccordianFunction(event : any, allaccordianTabs: any,index : any){
    event.preventDefault()
    // allaccordianTabs[index].removeEventListener('click', this.handleAccordianFunction)
    // this.sendMessage(this.actionAccordion({id: event.target.id, value: event.target.value}))
    this.SendRoomMessage(this.ROOMID,{id: event.target.id, value: event.target.value})
  }

  public addWindowEventListeners(){
    window.addEventListener('popstate',(event) =>{
      // this.sendMessage(this.actionBack({}))
      this.SendRoomMessage(this.ROOMID,this.actionBack({}))
    })
  }

  public setListeners(context : any){

    this.addWindowEventListeners()

    let allInputs : any  = document.getElementsByTagName("input");
    let allButtons : any = document.getElementsByTagName("button");
    let allInputButtons : any = document.querySelectorAll("input[type='submit']")
    let allInputCheckboxes : any = document.querySelectorAll("input[type='checkbox']")
    let allInputRadioButtons : any = document.querySelectorAll("input[type='radio']")
    let allSelects : any = document.querySelectorAll("select");




    let allA : any = document.querySelectorAll("a");

    Object.keys(allA).forEach((a) =>{
      allA[a].addEventListener('click', (event : any) =>{
        alert("Anchor link clicked")
        // this.sendMessage(this.actionAnchor({id: event.target.id}))
        this.SendRoomMessage(this.ROOMID,{id: event.target.id})
      });
    })

    let iconButtons : any = document.querySelectorAll(" .iconButton");

    Object.keys(iconButtons).forEach((iconbutton) =>{
      iconButtons[iconbutton].addEventListener('click', (event : any) =>{
        // this.sendMessage(this.actionIconButton({id: event.target.id}))
        this.SendRoomMessage(this.ROOMID,this.actionIconButton({id: event.target.id}))
      })
    });

    let allaccordianTabs : any = document.getElementsByClassName('accordionTab')

    document.getElementsByTagName('body')[0].addEventListener('wheel', (event) => {
      this.handleScroll()
      
    })


    document.getElementsByTagName('body')[0].addEventListener('touchmove', (event) => {
      this.handleScroll()
    })

    Object.keys(allaccordianTabs).forEach((accordion) =>{
      allaccordianTabs[accordion].addEventListener('click', (event : any) =>{
        // this.sendMessage(
        this.handleAccordianFunction(event, allaccordianTabs,accordion)
        this.setListeners(context)
        // )
        // event.preventDefault()
        // allaccordianTabs[accordion].removeEventListener('click', this.handleResponse, true)
        // this.sendMessage(this.actionAccordion({id: event.target.id, value: event.target.value, index: accordion}))

      })
    })



    Object.keys(allInputs).forEach((input: any) =>{

      console.log('input : ', input);
      
      allInputs[input].addEventListener('input', (event : any) =>{
        // this.sendMessage(this.valueInput({id: event.target.id, value: event.target.value}))
        this.SendRoomMessage(this.ROOMID,this.valueInput({id: event.target.id, value: event.target.value}))

      });
      allInputs[input].addEventListener('focus', (event : any) =>{
        // this.sendMessage(this.actionFocus({id: event.target.id, value: event.target.value}))
        this.SendRoomMessage(this.ROOMID, this.actionFocus({id: event.target.id, value: event.target.value}))

      });
    });

    Object.keys(allButtons).forEach((button : any) =>{
      allButtons[button].addEventListener('click', (event : any) =>{
        console.log("Button clicked");
        
        // this.sendMessage(this.actionClick({id: event.target.id, value: event.target.value}))
        this.SendRoomMessage(this.ROOMID, this.actionClick({id: event.target.id, value: event.target.value}))
      });
    });

    Object.keys(allInputButtons).forEach((inputButton : any) =>{
      allInputButtons[inputButton].addEventListener('click', (event : any) =>{
        console.log("Submit button clicked");      
        // this.sendMessage(this.actionClick({id: event.target.id, value: event.target.value}))
        this.SendRoomMessage(this.ROOMID, this.actionClick({id: event.target.id, value: event.target.value}))
      });
    });

    Object.keys(allInputCheckboxes).forEach((checkbox : any) =>{
      allInputCheckboxes[checkbox].addEventListener('click', (event : any) =>{
      // allInputButtons[checkbox].addEventListener('click', (event : any) =>{
        console.log("checkbox event");      
        // this.sendMessage(this.actionClick({id: event.target.id, value: event.target.value}))
        this.SendRoomMessage(this.ROOMID, this.actionClick({id: event.target.id, value: event.target.value}))
      });
    });

    Object.keys(allInputRadioButtons).forEach((radio : any) =>{
      allInputRadioButtons[radio].addEventListener('click', (event : any) =>{
        console.log("radio event");      
        // this.sendMessage(this.actionClick({id: event.target.id, value: event.target.value}))
        this.SendRoomMessage(this.ROOMID, this.actionClick({id: event.target.id, value: event.target.value}))
      });
    });

    Object.keys(allSelects).forEach((select : any) =>{
      allSelects[select].addEventListener('change', (event : any) =>{
        console.log("dropdown event");      
        // this.sendMessage(this.actionClick({id: event.target.id, value: event.target.value}))
        // this.sendMessage(this.valueInput({id: event.target.id, value: event.target.value}))
        this.SendRoomMessage(this.ROOMID, this.valueInput({id: event.target.id, value: event.target.value}))
      });
    });



    this.getNewMessage(context)

  }


  _2ndJson : any = {}

  sendMessage(data? : any){

    if(data){
      
      // this.coBrowsingService.sendMessageService(data)
      this.sendMessageService(data)
      // document.getElementsByClassName()
      return
    }


    debugger
    if(this as any === window) return

    delete (this as any).__ngContext__

    // this.service = (this as any)['coBrowsingService']

    for(let property in this){
      if(property == "window" ) return
      if(property == "_2ndJson") continue
      if(property == "service") continue
      if(property == "coBrowsingService") continue

      this._2ndJson[property] = (this as any)[property];
    }

    this._2ndJson.action = 'value';
    this.sendMessageService(this._2ndJson)
    // this.coBrowsingService.sendMessageService(this._2ndJson)
  }

  actionInput(data: any){
    return {
      action: 'input',
      ...data
    }
  }
  valueInput(data: any){
    return {
      action: 'value',
      ...data
    }
  }
  actionAccordion(data: any){
    return {
      action: 'accordion',
      activeTab : this.getActiveAccordionTabs(),
      ...data
    }
  }

  actionFocus(data: any){
    return {
      action: 'focus',
      ...data
    }
  }
  actionIconButton(data: any){
    return {
      action: 'icon',
      ...data
    }
  }

  actionClick(data: any){
    return{
      action : 'click1',
      sender : sessionStorage.getItem("YOURIP"),
      ...data
    }
  }
  actionAnchor(data: any){
    return{
      action : 'a',
      ...data
    }
  }

  actionBack(data: any){
    return{
      action : "back",
      ...data
    }
  }



  handleResponse(response : any, contextObject : any){
    if(response == "") return

        console.log("Previous Response : ", this.previousResponse);        

        switch(response.message.action){
          case "focus":
            document.getElementById(response.message.id)?.focus();
            break;

          case "input":
            console.log("in input");
            (contextObject as any)[response.message.id] = response.message.value;
            break;
            
          case "value":
            (contextObject as any)[response.message.id] = response.message.value;
            break;

          case "scroll":
            window.scrollTo({
              top: response.message.clientY,
              left: response.message.clientX,
              behavior: "auto"
            });
            break;

          case "touchmove":
            window.scrollTo({
              top: response.message.clientY,
              left: response.message.clientX,
              behavior: "auto"
            });
            break;

          case "click1":
            if(this.previousResponse.message.action.toString() != "focus") return
              document.getElementById(response.message.id)?.click();
            break;

          case "accordion":
            let callCount : number = 0

            let responseActiveTab = response.message.activeTab;
            let currentActiveTab = this.getActiveAccordionTabs();
            if(currentActiveTab != responseActiveTab) return
            if(this.compareObjects(this.previousResponse, response)) return
            let accordionTab : any  = document.getElementById(`${response.message.id}`);
            console.log("Accordion Tab : ", accordionTab);
            accordionTab.click()
            break;
          case "icon":
            let icon = document.getElementById(response.message.id);
            icon?.click();
            break;
          case "a":
            let a = document.getElementById(response.message.id);
            a?.click();
            break;
          case "back":
            this.location.back();
            break;


        }

        this.previousResponse = response;
  }

  handleMessage(message : any){
        
    const keys = Object.keys(message);
    
    for (let i = 0; i < keys.length; i++) {
      (this as any)[keys[i]] = message[keys[i]]
    }

  }


  getActiveAccordionTabs(){
    // let accordianTabs = document.querySelectorAll("accordionTab");
    // let tabWrappers = document.querySelectorAll('.tabWrapper')[0].classList
    let activeTab = document.querySelectorAll('.tabWrapper.active');
    console.log(activeTab);

    let activeTabTitle : any = document.querySelectorAll('.tabWrapper.active .text')[0];

    // if(activeTabTitle == undefined){
    //   return "allTabsClosed"
    // }
    let tabTitle = activeTabTitle.innerText;
    return tabTitle;
    // alert("Active Tab : " +tabTitle)
    
    
    // console.log("Tab Wrapper");
    // tabWrappers.forEach((element) =>{
    //   if(element == 'active'){

    //   } 
    // })
    


  }



  // Socket.io rooms

  // // Function to create a new room
  // createRoom() {
  //   const roomId = 'myRoom'; // Replace 'myRoom' with your desired room ID
  //   this.socket.emit('createRoom', roomId);
  // }

  // // Function to join an existing room
  // joinRoom() {
  //   const roomId = 'myRoom'; // Replace 'myRoom' with the room ID you want to join
  //   this.socket.emit('joinRoom', roomId);
  // }

  // // Function to leave the current room
  // leaveRoom() {
  //   this.socket.emit('leaveRoom');
  // }


  ROOMID : any;
  MESSAGE : any;


  joinRoomService(roomID : string, context : any){
    if(roomID && roomID.trim() !== ''){
      this.socket.emit('joinRoom', roomID)
      this.ROOMID = roomID
      this.handleMessageEvent(context)
      return "ROOMJOINED"
    }
    return "ERROR"
  }

  createRoomService(roomID : string, context : any){
    if(roomID && roomID.trim() !== ''){
      this.socket.emit('createRoom', roomID)
      this.ROOMID = roomID;
      this.handleMessageEvent(context)
      return "ROOMCREATED"
    }
    return "ERROR"
  }

  messages : Message [] = [];

  handleMessageEvent(context : any){
    this.socket.on('message', (data: Message) =>{
      console.log(data);
      if(data.message == undefined){
        this.handleResponse(data, context)
      }
      // console.log();
      
      this.messages.push(data);
    });
  }

  SendRoomMessage(roomID : string, message : any){
    // if(message && message.trim() !== ''){
      // this.socket.emit('sendMessage', roomID, message)
      this.socket.emit('sendMessage', roomID, message)
      return "MESSAGESENT"
    // }
    // return "ERROR"
  }
  // SendRoomMessage(roomID : string, message : any){
  //   if(message && message.trim() !== ''){
  //     // this.socket.emit('sendMessage', roomID, message)
  //     this.socket.emit('sendMessage', roomID, message)
  //     return "MESSAGESENT"
  //   }
  //   return "ERROR"
  // }

}

interface Message{
  user : string;
  message : any;
}
