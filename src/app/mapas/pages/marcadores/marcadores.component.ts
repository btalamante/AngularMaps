import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `.mapa-container{
      width: 100%;
      height: 100%
    }
    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }
    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements OnInit, AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-99.205421, 19.281586];
  marcadores: MarcadorColor[] = [];

  constructor() { }
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    /**
     * Creación de elemento HTML personalizado para colocar como marcador en el mapa
     */
    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola Mundo';
    // const marker = new mapboxgl.Marker(
    //   // { element: markerHtml }
    // )
    //   .setLngLat(this.center)
    //   .addTo(this.mapa);
    this.leerLocalStorage();

  }

  ngOnInit(): void {

  }

  irMarcador(marker: mapboxgl.Marker) {
    this.mapa.flyTo({ center: marker.getLngLat() });
  }

  agregarMarcador() {
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({ draggable: true, color: color })
      .setLngLat(this.center)
      .addTo(this.mapa);
    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });
    this.guardarMarcadoresLocalStorage();
    nuevoMarcador.on('dragend', () => this.guardarMarcadoresLocalStorage());
  }

  guardarMarcadoresLocalStorage() {
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.map(marcador => {
      const color = marcador.color;
      const { lng, lat } = marcador.marker!.getLngLat();
      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      });
    });
    window.localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalStorage() {
    if (!localStorage.getItem('marcadores')) return;
    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);
    lngLatArr.map(marcador => {
      const nuevoMarcador: mapboxgl.Marker = new mapboxgl.Marker({ draggable: true, color: marcador.color })
        .setLngLat(marcador.centro!)
        .addTo(this.mapa);
      this.marcadores.push({
        color: marcador.color,
        marker: nuevoMarcador
      });
      nuevoMarcador.on('dragend', () => this.guardarMarcadoresLocalStorage());
    });
  }
  borrarMarcador(indice: number) {
    this.marcadores[indice].marker?.remove();
    this.marcadores.splice(indice, 1);
    this.guardarMarcadoresLocalStorage();
  }



}
