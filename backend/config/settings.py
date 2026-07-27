from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    arc_rpc_url: str = "https://rpc.testnet.arc.network"
    arc_chain_id: int = 5042002
    arc_explorer: str = "https://testnet.arcscan.app"

    wallet_private_key: str = "0x0000000000000000000000000000000000000000000000000000000000000000"
    wallet_address: str = "0x0000000000000000000000000000000000000000"

    circle_api_key: str = ""
    kit_key: str = ""

    backend_port: int = 8000
    frontend_url: str = "http://localhost:3000"

    database_url: str = "sqlite:///./compliance.db"

    openai_api_key: str = ""

    environment: str = "development"
    debug: bool = True
    log_level: str = "INFO"

    usdc_address: str = "0x3600000000000000000000000000000000000000"
    eurc_address: str = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a"
    gateway_wallet_address: str = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9"
    gateway_minter_address: str = "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

settings = Settings()
