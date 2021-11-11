import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from "mapbox-gl";

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `.mapa-container{
      width: 100%;
      height: 100%
    }
    .row{
      background-color: white;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      z-index: 999;
      width: 400px;
    }
    `
  ]
})
export class ZoomRangeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-99.205421, 19.281586];

  constructor() {
    console.log('Constructor this.divMapa', this.divMapa);
  }
  /**
   * Necesitamos destruir los listeners cuando Angular destruya el componente
   */
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => { });
    this.mapa.off('zoomend', () => { });
    this.mapa.off('move', () => { });
  }
  ngAfterViewInit(): void {
    console.log('AfterViewInit this.divMapa', this.divMapa);
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    /**
     * Listener para controlar el momento en que se hace zoom
     */
    this.mapa.on('zoom', (ev) => {
      const zoomActual = this.mapa.getZoom();
      this.zoomLevel = zoomActual;
    });
    /**
     * Listener para topar el ZoomIn hasta 18
     * Al momento que el mapa detecta que se rebasan los 18 
     * hace zoomOut hasta 18
     */
    this.mapa.on('zoomend', (ev) => {
      if (this.mapa.getZoom() > 18) {
        this.mapa.zoomTo(18);
      }
    });
    /**
     * Listener para detectar el movimiento del mapa
     */
    this.mapa.on('move', (event) => {
      const target = event.target;
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat];
    });
  }

  ngOnInit(): void {
    console.log('OnInit this.divMapa', this.divMapa);
  }

  zoomIn() {
    this.mapa.zoomIn();
  }
  zoomOut() {
    this.mapa.zoomOut();
  }
  zoomCambio(valor: string) {
    this.mapa.zoomTo(+valor);
  }

}
