import { Component, OnInit } from '@angular/core';
/**
 * El '*' sirve para importar toda la librería del "from" y se le va a conocer como
 * as "alias", en este caso mapboxgl
 */
import * as mapboxgl from "mapbox-gl";


@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `#mapa{
      width: 100%;
      height: 100%
    }`
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-99.204522, 19.280824],
      zoom: 17
    });
  }

}
