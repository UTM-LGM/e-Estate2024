﻿using E_EstateV2_API.IRepository;
using E_EstateV2_API.Migrations;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RubberStocksController : ControllerBase
    {
        private readonly IGenericRepository<RubberStock> _genericRepository;

        public RubberStocksController(IGenericRepository<RubberStock> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetRubberStocks()
        {
            var rubberStock = await _genericRepository.GetAll();
            return Ok(rubberStock);
        }

        [HttpPost]
        public async Task<IActionResult> AddRubberStock([FromBody] RubberStock rubberStock)
        {
            rubberStock.createdDate = DateTime.Now;
            var addedRubberStock = await _genericRepository.Add(rubberStock);
            return Ok(addedRubberStock);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRubberStock([FromBody] RubberStock rubberStock)
        {
            rubberStock.updatedDate = DateTime.Now;
            var updatedCropType = await _genericRepository.Update(rubberStock); 
            return Ok(updatedCropType);
        }
    }
}