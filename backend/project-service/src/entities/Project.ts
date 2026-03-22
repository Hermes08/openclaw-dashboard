import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Project {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: "active" })
    status!: string; // active, archived, completed

    @Column({ default: "general" })
    category!: string; // real-estate, tech, ecommerce, etc.

    @Column({ nullable: true })
    domain?: string; // e.g. panamarealestatesale.com - used by automation cronjobs

    @Column("simple-array", { nullable: true })
    tags?: string[];

    @Column("json", { nullable: true })
    skills?: any;

    @Column("json", { nullable: true })
    workflows?: any;

    @Column({ nullable: true })
    repositoryUrl?: string;

    @Column({ default: "main" })
    branch!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
