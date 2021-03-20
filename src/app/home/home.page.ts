import { Component, Renderer2, ViewChild } from '@angular/core';
import { AnimationController, Animation, Platform, Gesture, GestureController, GestureDetail } from '@ionic/angular';

interface ItemMenu {
  icon: string;
  text: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('blocks') blocks: any;
  @ViewChild('background') background: any;
  @ViewChild('swipeDown') swipeDown: any;

  private arrayOptions: Array<ItemMenu> = [
    {icon: 'sparkles-outline', text:'Pix'},
    {icon: 'barcode-outline', text:'Pagar'},
    {icon: 'person-add-outline', text:'Indicar amigos'},
    {icon: 'trending-up-outline', text:'Transferir'},
    {icon: 'trending-down-outline', text:'Depositar'},
    {icon: 'bandage-outline', text:'Emprétimo'},
    {icon: 'card-outline', text:'Cartão virtual'},
    {icon: 'phone-portrait-outline', text:'Recarga de celular'},
    {icon: 'options-outline', text:'Ajustar limite'},
    {icon: 'lock-closed-outline', text:'Bloquear cartão'},
    {icon: 'chatbox-ellipses-outline', text:'Cobrar'},
    {icon: 'bandage-outline', text:'Doação'},
    {icon: 'help-circle-outline', text:'Me ajuda'},
  ]

  private arrayItemsMenu: Array<ItemMenu> = [
    {icon:'help-circle-outline' , text:'Me ajuda'},
    {icon:'person-outline' , text:'Perfil'},
    {icon:'settings-outline' , text:'Configurar conta'},
    {icon:'key-outline' , text:'Minhas chaves Pix'},
    {icon:'id-card-outline' , text:'Configurar cartão'},
    {icon:'gift-outline' , text:'Configurar Rewards'},
    {icon:'storefront-outline' , text:'Pedir conta PJ'},
    {icon:'notifications-outline' , text:'Configurar notificações'},
    {icon:'phone-portrait-outline' , text:'Configurações do app'},
    {icon:'information-circle-outline' , text:'Sobre'},
  ]

  private isToggled: boolean = false;
  private initialStep: number = 0;
  private maxTranslateY: number = 0;
  private animation: Animation;
  private gesture: Gesture;
  private swiping: boolean = false;

  public slidesOptions = {
    slidesPerView: 4,
    freeMode:true
  }

  constructor(
    private animationCtrl: AnimationController,
    private platform: Platform,
    private renderer: Renderer2,
    private gestureCtrl: GestureController
  ) {
    this.maxTranslateY = this.platform.height() - 200;
  }

  toggleBlocks(){
    this.initialStep = this.initialStep === 0 ? this.maxTranslateY : 0;

    this.gesture.enable(false)

    this.animation.direction(this.initialStep === 0 ? 'reverse' : 'normal').play();

    this.setBackgroundOpacity();
  }

  /**
   * evento é disparado depois que Angular carregou todos
   * os componentes da tela
   */
  ngAfterViewInit(){
    this.createAnimation();
    this.detectSwipe();
  }

  createAnimation(){
    this.animation = this.animationCtrl.create()
    .addElement(this.blocks.nativeElement)
    .duration(300)
    .fromTo('transform', 'translateY(0)', `translateY(${this.maxTranslateY}px)`)
    .onFinish(() => this.gesture.enable(true))
  }

  setBackgroundOpacity(stepValue: number = null){
    this.renderer.setStyle(this.background.nativeElement, 'opacity', stepValue ? stepValue : this.initialStep === 0 ? '0' : '1')
  }

  fixedBlocks(): boolean{
    return this.swiping || this.initialStep === this.maxTranslateY;
  }

  detectSwipe(){
    this.gesture = this.gestureCtrl.create({
      el: this.swipeDown.el,
      gestureName: 'swipe-down',
      threshold: 0,
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev)
    }, true)

    this.gesture.enable(true)
  }

  onMove(event: GestureDetail){
    if(!this.swiping){
      this.animation.direction('normal').progressStart(true);

      this.swiping = true
    }

    const step: number = this.getStep(event);

    this.animation.progressStep(step)
    this.setBackgroundOpacity(step)
  }

  onEnd(event: GestureDetail){
    if(!this.swiping) return;

    this.gesture.enable(false)
    const step: number = this.getStep(event);
    const shouldComplete: boolean = step > 0.5;

    this.animation.progressEnd(shouldComplete ? 1 : 0, step)

    this.initialStep = shouldComplete ? this.maxTranslateY : 0;

    this.setBackgroundOpacity();
    this.swiping = false;
  }

  getStep(ev: GestureDetail): number {
    const delta: number = this.initialStep = ev.deltaY;

    return delta/this.maxTranslateY;
  }
}
