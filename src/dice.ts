export default class DiceTray{
    private dice: Die[];
    constructor(public diceString: string) {
        this.dice = diceString.toLowerCase().replace(/\s+/g, '').split('+').map(x => this.term(x)).reduce((x, y) => x.concat(y));
    }
    /**
     * to examine an individual term in the dice string
     * @param d 
     * @returns 
     */
    private term(d: string): (Die)[] {
        let op = d.split("d");
        if(op.length === 1) { // constant
            return [new Die(0, parseInt(op[0]))];
        } else if (op.length === 2) { // dice expression
            try {
            return Array(parseInt(op[0])).fill(new Die(parseInt(op[1]))) as Die[];
            } catch (e) {
                console.error(op);
                throw "argument error: " + op;
            }
        } else {// more than one 'd' in a term
            console.error("invalid dice expression" + d);
            throw "invalid dice expression" + d;
        }
    }
    /**
     * rolls with disadvantage on all d20's
     * @returns 
     */
    public disadvantageRoll(): Result {
        return this.uRoll("disadvantageRoll");
    }
    /**
     * * rolls with advantage on all d20's
     * @returns 
     */
    public advantageRoll(): Result {
        return this.uRoll("advantageRoll");
    }
    /**
     * rolls streight
     * @returns 
     */
    public roll(): Result {
        return this.uRoll("roll");
    }
    private uRoll(method: string): Result {
        const res: Result[] =  this.dice.map(x => x[method]());
        const r = res.reduce(Result.combine);
        r.details = `${method} [${r.details}]`
        return r;
    }
}
export class Result {
    constructor (sum: number) {
        this.sum = sum;
        this.details = sum.toString();
    }
    /**
     * integer string showing the total
     */
    public sum: number;
    /**
     * string showing how result was determined
     */
    public details: string;
    /**
     * static method to combine two results into the same result
     * @param a 
     * @param b 
     * @returns 
     */
    static combine(a: Result, b: Result) {
        return {
            sum: a.sum + b.sum,
            details: `${a.details} + ${b.details}`
        }
    }
}
export class Die{
    constructor (
        private base: number, 
        private constant = 0
    ) {}
    public roll(): Result {
        const res = Math.floor(Math.random() * this.base) + (this.base === 0 ? 0 : 1) + this.constant;
        return {sum: res, details: res.toString()};
    }
    public advantageRoll(): Result {
        const [a, b] = [this.roll(), this.roll()];
        return this.base === 20 ? { 
            sum: Math.max(a.sum, b.sum), 
            details: "["+a.details+", "+b.details+"]" 
        }: a ;
    }
    public disadvantageRoll(): Result {
        const [a, b] = [this.roll(), this.roll()];
        return this.base === 20 ? { 
            sum: Math.min(a.sum, b.sum), 
            details: "["+a.details+", "+b.details+"]" 
        }: a ;
    }
}