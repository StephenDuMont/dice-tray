export default class DiceTray{
    private dice: (die)[];
    constructor(s: string) {
        this.dice = s.toLowerCase().split("+").map(x => this.term(x)).reduce((x, y) => x.concat(y));
    }
    private term(d: string): (die)[] {
        let op = d.split("d");
        if(op.length === 1) {
            return [new die(0, parseInt(op[0]))];
        } else if (op.length === 2) {
            try {
            return Array(parseInt(op[0])).fill(new die(parseInt(op[1]))) as die[];
            } catch (e) {
                console.error(op);
                throw "argument error: " + op;
            }
        } else {
            console.error("invalid dice expression" + d);
            throw "invalid dice expression" + d;
        }
    }
    public disadvantageRoll() {
        return this.uRoll("disadvantageRoll");
    }
    public advantageRoll() {
        return this.uRoll("advantageRoll");
    }
    public roll() {
        return this.uRoll("roll");
    }
    private uRoll(method: string): result {
        const res: result[] =  this.dice.map(x => x[method]());
        const r = res.reduce(result.combine);
        r.details = `${method} [${r.details}]`
        return r;
    }
}
class result {
    constructor (sum: number) {
        this.sum = sum;
        this.details = sum.toString();
    }
    sum: number;
    details: string;
    static combine(a: result, b: result) {
        return {
            sum: a.sum + b.sum,
            details: `${a.details} + ${b.details}`
        }
    }
}
export class die{
    constructor (
        private base: number, 
        private constant = 0
    ) {}
    public roll(): result {
        const res = Math.floor(Math.random() * this.base) + (this.base === 0 ? 0 : 1) + this.constant;
        return {sum: res, details: res.toString()};
    }
    public advantageRoll(): result {
        const [a, b] = [this.roll(), this.roll()];
        return this.base === 20 ? { 
            sum: Math.max(a.sum, b.sum), 
            details: "["+a.details+", "+b.details+"]" 
        }: a ;
    }
    public disadvantageRoll(): result {
        const [a, b] = [this.roll(), this.roll()];
        return this.base === 20 ? { 
            sum: Math.min(a.sum, b.sum), 
            details: "["+a.details+", "+b.details+"]" 
        }: a ;
    }
}
/*
if (process.argv[2]) {
    const dt = new DiceTray(process.argv[2]);
    switch(process.argv[3]) {
        case "+":
            console.log(dt.advantageRoll());
            break;
        case "-":
            console.log(dt.disadvantageRoll());
            break;
        default:
            console.log(dt.roll());
            break;
    }
}
*/