import { TransformNode } from "babylonjs/Meshes/transformNode";
import { Circ, gsap, Bounce } from 'gsap';

/** 
 * Class contains operation related to animation
*/
export class AnimationManager {


    /**
      * Apply boucning animation returns promise on complete
      * @param TransformNode TransformNodeAn object which should play this animation
      * @param amplitude The start height of the bounce
      * @param duration Period of time in ms from the start
      * @memberof AnimationManager 
      */
    applyBouncing(node: TransformNode, amplitude: number, duration: any) {


        return new Promise((resolve, reject) => {
            // console.log("duration ", duration);
            // console.log("amplitude ", amplitude);
            // console.log("node.position ", node.position);
            node.position.y = amplitude;

            // ms to sec
            var durationinSec = duration / 1000;

            gsap.to(node.position, {
                duration: durationinSec, y: 0, ease: Bounce.easeOut, delay: 0.5,
                onComplete: () => {
                    resolve("End");
                }
            });
        });
    }

    /**
     * Compute and set disctance of camera as per Bounce animation amplitude
     * @param camera camera to set
     * @param amplitude The start height of the bounce
     * @memberof AnimationManager 
     */
    setCameraAnimPreview(camera: any, amplitude: number) {
        return new Promise((resolve, reject) => {

            // console.log(amplitude)
            // console.log(camera.radius)
            var minCamDistance = (8 + amplitude)
            if(amplitude>5)
            var minCamDistance = (12 + amplitude)

            if (camera.radius < minCamDistance || camera.alpha != 1.56 || camera.beta != 1.47) {
                // console.log("setcamera ");
                gsap.to(camera, {
                    duration: 0.5,
                    alpha: 1.56,
                    beta: 1.47,
                    radius: minCamDistance,
                    ease: Circ.easeOut,
                    onComplete: () => {
                        resolve("End");
                    }
                });
            }
            else {
                resolve("End");
            }
        });
    }

    /**
    * back Button Anim
    */
    private buttonAnim: any = null;

    /**
     * Performs back button animation
     * on click reset
     * @param button back button
     * @memberof AnimationManager 
     */
    animateBackButton(button: Element) {

        this.buttonAnim = gsap.to(button, { scale: 2.0, repeat: -1, yoyo: true });
        // return scaleTween;
    }

    /**
    * stops button animation 
    */
    stopBackButtonAnim() {
        this.buttonAnim.kill();
    }
}