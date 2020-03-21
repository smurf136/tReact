import React, { Component } from 'react';
import Matter from 'matter-js';

export default class Gage extends Component {

  state = {};

  componentDidMount() {
    let Engine = Matter.Engine,
      Evens = Matter.Events,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Body = Matter.Body,
      Composite = Matter.Composite,
      Composites = Matter.Composites,
      Common = Matter.Common,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Vector = Matter.Vector
      

    let engine = Engine.create();
    let world = Engine.create().world

    let render = Render.create({
      element: this.refs.scene,
      engine: engine,
      options: {
        width: 600,
        height: 800,
        wireframes: false
      }
    });

    let runner = Runner.create()
    Runner.run(runner, engine)

    let r1 = Bodies.rectangle(340, 780, 700, 20, { isStatic: true, angle: Math.PI * 0.04 })

    World.add(engine.world, [
      Bodies.rectangle(100, 150, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }),
      Bodies.rectangle(500, 350, 700, 20, { isStatic: true, angle: 270 }),
      r1
    ])

    let group = Body.nextGroup(true)
    let length = 200
    let width = 25

    let pendulum = Composites.stack(350, 160, 2, 1, -20, 0, (x,y) => {
      return Bodies.rectangle(x, y, length, width, {
        collisionFilter: { group: group },
        frictionAir: 0,
        chamfer: 5,
        render: {
          fillStyle: '',
          lineWidth: 1
        }  
      })
    })

    world.gravity.scale = 1

    Composites.chain(pendulum, 0.45, 0, -0.45, 0, {
      stiffness: 0.9,
      length: 0,
      angularStiffness: 0.7,
      render: {
        strokeStyle: '#4a485b'
      }
    })

    World.add(world, pendulum)

    // add mouse control
    let mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: true
          }
        }
      });

    World.add(engine.world, mouseConstraint);

    Matter.Events.on(mouseConstraint, 'mousedown', function(event) {
      World.add(engine.world, Bodies.circle(150, 50, 30, { restitution: 0.7 }));
      World.add(engine.world, Matter.Axes.fromVertices(150, 50, 30,))
      World.add(engine.world, pendulum)
    });

    Engine.run(engine);

    Render.run(render);

  }

  render() {

    return <div ref='scene' />;
  }
}
