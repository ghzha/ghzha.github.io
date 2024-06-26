interface Point {
    x: number;
    y: number;
}

interface CircleOptions {
    origin: Point;
    speed: number;
    color: string;
    angle: number;
    context: CanvasRenderingContext2D;
}

class Circle {
    origin: Point;
    position: Point;
    color: string;
    speed: number;
    angle: number;
    context: CanvasRenderingContext2D;
    renderCount: number;

    constructor({ origin, speed, color, angle, context }: CircleOptions) {
        this.origin = origin;
        this.position = { ...this.origin };
        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.context = context;
        this.renderCount = 0;
    }

    draw() {
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
        this.context.fill();
    }

    move() {
        this.position.x = Math.sin(this.angle) * this.speed + this.position.x;
        this.position.y =
            Math.cos(this.angle) * this.speed +
            this.position.y +
            this.renderCount * 0.3;
        this.renderCount++;
    }
}

interface BoomOptions {
    origin: Point;
    context: CanvasRenderingContext2D;
    circleCount?: number;
    area: { width: number; height: number };
}

class Boom {
    origin: Point;
    context: CanvasRenderingContext2D;
    circleCount: number;
    area: { width: number; height: number };
    stop: boolean;
    circles: Circle[];

    constructor({ origin, context, circleCount = 16, area }: BoomOptions) {
        this.origin = origin;
        this.context = context;
        this.circleCount = circleCount;
        this.area = area;
        this.stop = false;
        this.circles = [];
    }

    private randomArray<T>(range: T[]): T {
        const length = range.length;
        const randomIndex = Math.floor(length * Math.random());
        return range[randomIndex];
    }

    private randomColor(): string {
        const range = ["8", "9", "A", "B", "C", "D", "E", "F"];
        return (
            "#" +
            this.randomArray(range) +
            this.randomArray(range) +
            this.randomArray(range) +
            this.randomArray(range) +
            this.randomArray(range) +
            this.randomArray(range)
        );
    }

    private randomRange(start: number, end: number): number {
        return (end - start) * Math.random() + start;
    }

    init() {
        for (let i = 0; i < this.circleCount; i++) {
            const circle = new Circle({
                context: this.context,
                origin: this.origin,
                color: this.randomColor(),
                angle: this.randomRange(Math.PI - 1, Math.PI + 1),
                speed: this.randomRange(1, 6),
            });
            this.circles.push(circle);
        }
    }

    move() {
        this.circles.forEach((circle, index) => {
            if (
                circle.position.x > this.area.width ||
                circle.position.y > this.area.height
            ) {
                this.circles.splice(index, 1);
            } else {
                circle.move();
            }
        });

        if (this.circles.length === 0) {
            this.stop = true;
        }
    }

    draw() {
        this.circles.forEach((circle) => circle.draw());
    }
}

class CursorSpecialEffects {
    computerCanvas: HTMLCanvasElement;
    renderCanvas: HTMLCanvasElement;
    computerContext: CanvasRenderingContext2D;
    renderContext: CanvasRenderingContext2D;
    globalWidth: number;
    globalHeight: number;
    booms: Boom[];
    running: boolean;

    constructor() {
        this.computerCanvas = document.createElement("canvas");
        this.renderCanvas = document.createElement("canvas");

        this.computerContext = this.computerCanvas.getContext("2d")!;
        this.renderContext = this.renderCanvas.getContext("2d")!;

        this.globalWidth = window.innerWidth;
        this.globalHeight = window.innerHeight;

        this.booms = [];
        this.running = false;
    }

    handleMouseDown(e: MouseEvent) {
        const boom = new Boom({
            origin: { x: e.clientX, y: e.clientY },
            context: this.computerContext,
            area: {
                width: this.globalWidth,
                height: this.globalHeight,
            },
        });
        boom.init();
        this.booms.push(boom);
        if (!this.running) {
            this.run();
        }
    }

    handlePageHide() {
        this.booms = [];
        this.running = false;
    }

    init() {
        const style = this.renderCanvas.style;
        style.position = "fixed";
        style.top = style.left = "0";
        style.zIndex = "999999999999999999999999999999999999999999";
        style.pointerEvents = "none";

        style.width = `${this.globalWidth}px`;
        style.height = `${this.globalHeight}px`;
        this.renderCanvas.width = this.computerCanvas.width = this.globalWidth;
        this.renderCanvas.height = this.computerCanvas.height =
            this.globalHeight;

        document.body.append(this.renderCanvas);

        window.addEventListener("mousedown", this.handleMouseDown.bind(this));
        window.addEventListener("pagehide", this.handlePageHide.bind(this));
        window.addEventListener("resize", () => {
            this.globalWidth = window.innerWidth;
            this.globalHeight = window.innerHeight;
            this.renderCanvas.style.width = `${this.globalWidth}px`;
            this.renderCanvas.style.height = `${this.globalHeight}px`;
            this.renderCanvas.width = this.computerCanvas.width =
                this.globalWidth;
            this.renderCanvas.height = this.computerCanvas.height =
                this.globalHeight;
        });
    }

    run() {
        this.running = true;
        if (this.booms.length === 0) {
            this.running = false;
            return;
        }

        requestAnimationFrame(this.run.bind(this));

        this.computerContext.clearRect(
            0,
            0,
            this.globalWidth,
            this.globalHeight,
        );
        this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight);

        this.booms.forEach((boom, index) => {
            if (boom.stop) {
                this.booms.splice(index, 1);
            } else {
                boom.move();
                boom.draw();
            }
        });

        this.renderContext.drawImage(
            this.computerCanvas,
            0,
            0,
            this.globalWidth,
            this.globalHeight,
        );
    }
}
// const cursorSpecialEffects = new CursorSpecialEffects();
// cursorSpecialEffects.init();
// console.log("CursorSpecialEffects init");

export default CursorSpecialEffects;
