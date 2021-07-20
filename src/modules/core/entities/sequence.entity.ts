import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("DNA_Sequences")
export class DNASequencesEntity {
  @PrimaryGeneratedColumn({ name: "ID", type: "int" })
  public id?: number;
  @Column({ name: "SEQUENCE", type: "varchar", length: 400 })
  public sequence: string;
  @Column({ name: "SUBJECT_TYPE", type: "varchar", length: 1 })
  public subjectType!: string;
}
