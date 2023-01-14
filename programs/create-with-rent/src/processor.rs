use crate::instruction::CreateWithRentInstruction;
use borsh::BorshDeserialize;
use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, pubkey::Pubkey};

pub struct Processor;
impl Processor {
    pub fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction: CreateWithRentInstruction =
            CreateWithRentInstruction::try_from_slice(instruction_data)?;
        match instruction {
            CreateWithRentInstruction::CreateAccountWithRent(args) => {
                // handle instruction
                Ok(())
            }
        }
    }
}
